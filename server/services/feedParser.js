const Parser = require('rss-parser');
const axios = require('axios');
const crypto = require('crypto');
const Article = require('../models/Article');
const FEED_SOURCES = require('../config/feedSources');
const { runAlertEngine } = require('./alertEngine');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'LapisForge-Dashboard/1.0 (RSS Reader)',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────

const hashUrl = (url) => crypto.createHash('md5').update(url).digest('hex');

const extractImage = (item) => {
  if (item.mediaContent?.$.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) return item.enclosure.url;
  // Try to extract first img src from content
  const contentHtml = item['content:encoded'] || item.content || '';
  const match = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return null;
};

const cleanDescription = (raw = '') => {
  // Strip HTML tags, decode entities, trim to 300 chars
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
};

// ── RSS Fetcher ───────────────────────────────────────────────────────────

const fetchRssFeed = async (source) => {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = [];

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const url = item.link.trim();
      const urlHash = hashUrl(url);

      articles.push({
        title: item.title.trim().slice(0, 500),
        url,
        urlHash,
        description: cleanDescription(item.contentSnippet || item.content || item.summary || ''),
        source: source.name,
        category: source.category,
        imageUrl: extractImage(item),
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        tags: [],
      });
    }

    return articles;
  } catch (err) {
    console.warn(`[FeedParser] Failed to fetch ${source.name}: ${err.message}`);
    return [];
  }
};

// ── CryptoPanic Fetcher ───────────────────────────────────────────────────

const fetchCryptoPanic = async () => {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;
  if (!apiKey || apiKey === 'YOUR_CRYPTOPANIC_KEY_HERE') {
    return []; // Silently skip if key not configured
  }

  try {
    const response = await axios.get('https://cryptopanic.com/api/v1/posts/', {
      params: {
        auth_token: apiKey,
        public: true,
        kind: 'news',
      },
      timeout: 10000,
    });

    const articles = [];
    for (const item of response.data.results || []) {
      if (!item.title || !item.url) continue;

      const url = item.url.trim();
      articles.push({
        title: item.title.trim().slice(0, 500),
        url,
        urlHash: hashUrl(url),
        description: '',
        source: 'CryptoPanic',
        category: 'crypto',
        imageUrl: null,
        publishedAt: item.published_at ? new Date(item.published_at) : new Date(),
        tags: (item.currencies || []).map((c) => c.code),
      });
    }

    return articles;
  } catch (err) {
    console.warn(`[FeedParser] CryptoPanic fetch failed: ${err.message}`);
    return [];
  }
};

// ── Deduplication & Save ─────────────────────────────────────────────────

const saveArticles = async (articles) => {
  if (!articles.length) return { saved: 0, skipped: 0 };

  let saved = 0;
  let skipped = 0;

  // Use bulkWrite with upsert for efficiency — skips existing by urlHash
  const ops = articles.map((article) => ({
    updateOne: {
      filter: { urlHash: article.urlHash },
      update: { $setOnInsert: article },
      upsert: true,
    },
  }));

  try {
    const result = await Article.bulkWrite(ops, { ordered: false });
    saved = result.upsertedCount;
    skipped = articles.length - saved;
  } catch (err) {
    // Partial failures are okay — some may have been duplicate key errors
    console.warn(`[FeedParser] BulkWrite partial error: ${err.message}`);
  }

  return { saved, skipped };
};

// ── Main Refresh ──────────────────────────────────────────────────────────

const refreshAllFeeds = async () => {
  console.log('[FeedParser] Starting feed refresh...');
  const startTime = Date.now();

  const enabledSources = FEED_SOURCES.filter((s) => s.enabled);
  const results = { sources: 0, saved: 0, skipped: 0, errors: 0 };

  // Fetch all feeds in parallel (with a concurrency cap)
  const BATCH_SIZE = 5;
  for (let i = 0; i < enabledSources.length; i += BATCH_SIZE) {
    const batch = enabledSources.slice(i, i + BATCH_SIZE);

    const fetched = await Promise.allSettled(
      batch.map((source) => {
        if (source.type === 'cryptopanic') return fetchCryptoPanic();
        return fetchRssFeed(source);
      })
    );

    for (let j = 0; j < fetched.length; j++) {
      const result = fetched[j];
      results.sources++;

      if (result.status === 'fulfilled' && result.value.length > 0) {
        const { saved, skipped } = await saveArticles(result.value);
        results.saved += saved;
        results.skipped += skipped;
        if (saved > 0) runAlertEngine(result.value).catch(() => {});
      } else if (result.status === 'rejected') {
        results.errors++;
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `[FeedParser] Refresh complete in ${elapsed}s — ` +
    `sources: ${results.sources}, new: ${results.saved}, dupes: ${results.skipped}, errors: ${results.errors}`
  );

  return results;
};

module.exports = { refreshAllFeeds };
