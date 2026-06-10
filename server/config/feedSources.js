/**
 * Central feed source registry.
 * Add, remove, or toggle sources here without touching service logic.
 *
 * type: 'rss' | 'cryptopanic'
 * category: 'depin' | 'ai' | 'crypto' | 'tech'
 * enabled: toggle individual sources without deleting them
 */

const FEED_SOURCES = [
  // ── DePIN ──────────────────────────────────────────────────────────────
  {
    id: 'messari-depin',
    name: 'Messari',
    type: 'rss',
    category: 'depin',
    url: 'https://messari.io/rss/news.xml',
    enabled: true,
  },
  {
    id: 'coindesk-web3',
    name: 'CoinDesk',
    type: 'rss',
    category: 'depin',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    enabled: true,
  },
  {
    id: 'thedefiant',
    name: 'The Defiant',
    type: 'rss',
    category: 'depin',
    url: 'https://thedefiant.io/feed',
    enabled: true,
  },
  {
    id: 'iotext-blog',
    name: 'IoTeX Blog',
    type: 'rss',
    category: 'depin',
    url: 'https://blog.iotex.io/feed',
    enabled: true,
  },

  // ── AI ─────────────────────────────────────────────────────────────────
  {
    id: 'mit-tech-review',
    name: 'MIT Tech Review',
    type: 'rss',
    category: 'ai',
    url: 'https://www.technologyreview.com/feed/',
    enabled: true,
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    type: 'rss',
    category: 'ai',
    url: 'https://venturebeat.com/category/ai/feed/',
    enabled: true,
  },
  {
    id: 'ars-technica-ai',
    name: 'Ars Technica',
    type: 'rss',
    category: 'ai',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    enabled: true,
  },
  {
    id: 'the-batch',
    name: 'The Batch (DeepLearning.AI)',
    type: 'rss',
    category: 'ai',
    url: 'https://www.deeplearning.ai/the-batch/feed/',
    enabled: true,
  },

  // ── Crypto ─────────────────────────────────────────────────────────────
  {
    id: 'cointelegraph',
    name: 'CoinTelegraph',
    type: 'rss',
    category: 'crypto',
    url: 'https://cointelegraph.com/rss',
    enabled: true,
  },
  {
    id: 'decrypt',
    name: 'Decrypt',
    type: 'rss',
    category: 'crypto',
    url: 'https://decrypt.co/feed',
    enabled: true,
  },
  {
    id: 'bitcoinmagazine',
    name: 'Bitcoin Magazine',
    type: 'rss',
    category: 'crypto',
    url: 'https://bitcoinmagazine.com/.rss/full/',
    enabled: true,
  },
  {
    id: 'coindesk-markets',
    name: 'CoinDesk Markets',
    type: 'rss',
    category: 'crypto',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml',
    enabled: true,
  },
  {
    id: 'theblock',
    name: 'The Block',
    type: 'rss',
    category: 'crypto',
    url: 'https://www.theblock.co/rss.xml',
    enabled: true,
  },
  {
    id: 'blockworks',
    name: 'Blockworks',
    type: 'rss',
    category: 'crypto',
    url: 'https://blockworks.co/feed',
    enabled: true,
  },

  // ── Tech ───────────────────────────────────────────────────────────────
  {
    id: 'hackernews',
    name: 'Hacker News',
    type: 'rss',
    category: 'tech',
    url: 'https://hnrss.org/frontpage',
    enabled: true,
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    type: 'rss',
    category: 'tech',
    url: 'https://techcrunch.com/feed/',
    enabled: true,
  },
  {
    id: 'wired',
    name: 'Wired',
    type: 'rss',
    category: 'tech',
    url: 'https://www.wired.com/feed/rss',
    enabled: true,
  },
  {
    id: 'oracle-blog',
    name: 'Oracle Cloud Blog',
    type: 'rss',
    category: 'tech',
    url: 'https://blogs.oracle.com/cloud-infrastructure/rss',
    enabled: true,
  },
];

module.exports = FEED_SOURCES;
