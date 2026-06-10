const Article = require('../models/Article');

// GET /api/analytics/overview
const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [total, last7Count, last30Count, byCategory, bySource, dailyVolume] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ publishedAt: { $gte: last7 } }),
      Article.countDocuments({ publishedAt: { $gte: last30 } }),
      Article.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Article.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Articles per day for last 14 days
      Article.aggregate([
        { $match: { publishedAt: { $gte: new Date(now - 14 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      total,
      last7Days: last7Count,
      last30Days: last30Count,
      byCategory,
      topSources: bySource,
      dailyVolume,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// GET /api/analytics/trending — top words in titles over last 7 days
const getTrending = async (req, res) => {
  try {
    const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const articles = await Article.find({ publishedAt: { $gte: last7 } })
      .select('title category')
      .lean();

    const STOPWORDS = new Set([
      'the','a','an','and','or','but','in','on','at','to','for','of','with',
      'is','are','was','were','be','been','has','have','had','will','would',
      'this','that','these','those','it','its','by','from','as','up','into',
      'how','what','why','when','who','new','says','say','after','amid',
      'about','over','can','could','may','more','than','also','just','now',
    ]);

    const wordCount = {};
    const wordCategory = {};
    for (const article of articles) {
      const words = article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w));

      for (const word of words) {
        wordCount[word] = (wordCount[word] || 0) + 1;
        if (!wordCategory[word]) wordCategory[word] = {};
        wordCategory[word][article.category] = (wordCategory[word][article.category] || 0) + 1;
      }
    }

    const trending = Object.entries(wordCount)
      .filter(([, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 30)
      .map(([word, count]) => ({
        word,
        count,
        topCategory: Object.entries(wordCategory[word]).sort(([, a], [, b]) => b - a)[0]?.[0],
      }));

    res.json({ trending, period: '7d' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending' });
  }
};

// POST /api/analytics/digest — generate AI weekly digest via Claude API
const generateDigest = async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ message: 'Anthropic API key not configured' });
  }

  try {
    const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const articles = await Article.find({ publishedAt: { $gte: last7 } })
      .select('title description source category publishedAt')
      .sort({ publishedAt: -1 })
      .limit(80)
      .lean();

    if (!articles.length) {
      return res.status(400).json({ message: 'No articles in the last 7 days to summarize' });
    }

    const grouped = { depin: [], ai: [], crypto: [], tech: [] };
    for (const a of articles) {
      if (grouped[a.category]) grouped[a.category].push(`- ${a.title} (${a.source})`);
    }

    const prompt = `You are an intelligence analyst for Lapis Forge, a decentralized infrastructure business. 
Summarize the key developments from the past week across these categories. 
Focus on what matters for node operators, DePIN investors, and infrastructure builders.
Be concise and actionable — 3-5 bullet points per category, skip fluff.

DePIN & Decentralized Infrastructure:
${grouped.depin.slice(0, 20).join('\n') || 'No articles'}

AI News:
${grouped.ai.slice(0, 20).join('\n') || 'No articles'}

Crypto & Web3:
${grouped.crypto.slice(0, 20).join('\n') || 'No articles'}

Tech & Infrastructure:
${grouped.tech.slice(0, 20).join('\n') || 'No articles'}

Format your response as a clean weekly digest with section headers. End with a "Key Takeaways" section of 3 actionable insights for a DePIN node operator.`;

    const axios = require('axios');
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const digest = response.data.content?.[0]?.text || '';
    res.json({ digest, generatedAt: new Date(), articleCount: articles.length });
  } catch (err) {
    console.error('Digest error:', err.message);
    res.status(500).json({ message: 'Failed to generate digest' });
  }
};

module.exports = { getOverview, getTrending, generateDigest };
