const Article = require('../models/Article');
const { refreshAllFeeds } = require('../services/feedParser');

const VALID_CATEGORIES = ['depin', 'ai', 'crypto', 'tech'];
const PAGE_SIZE = 20;

// GET /api/articles
// Query params: category, page, unreadOnly, search
const getArticles = async (req, res) => {
  try {
    const { category, page = 1, unreadOnly, search } = req.query;

    const filter = {};

    if (category && VALID_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { source: { $regex: escaped, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const skip = (pageNum - 1) * PAGE_SIZE;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Article.countDocuments(filter),
    ]);

    res.json({
      articles,
      pagination: {
        page: pageNum,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
        hasMore: skip + articles.length < total,
      },
    });
  } catch (err) {
    console.error('getArticles error:', err);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
};

// GET /api/articles/stats
const getStats = async (req, res) => {
  try {
    const [total, unread, byCategory] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ isRead: false }),
      Article.aggregate([
        {
          $group: {
            _id: '$category',
            total: { $sum: 1 },
            unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const categoryMap = {};
    for (const cat of byCategory) {
      categoryMap[cat._id] = { total: cat.total, unread: cat.unread };
    }

    res.json({
      total,
      unread,
      categories: categoryMap,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// PATCH /api/articles/:id/read
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead = true } = req.body;

    const article = await Article.findByIdAndUpdate(
      id,
      { isRead },
      { new: true, lean: true }
    );

    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ article });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update article' });
  }
};

// PATCH /api/articles/mark-all-read
const markAllRead = async (req, res) => {
  try {
    const { category } = req.body;
    const filter = { isRead: false };
    if (category && VALID_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const result = await Article.updateMany(filter, { isRead: true });
    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark articles as read' });
  }
};

// PATCH /api/articles/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.isBookmarked = !article.isBookmarked;
    await article.save();

    res.json({ article, isBookmarked: article.isBookmarked });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle bookmark' });
  }
};

// POST /api/articles/refresh — manual trigger
const triggerRefresh = async (req, res) => {
  try {
    // Respond immediately, run refresh in background
    res.json({ message: 'Feed refresh started' });
    await refreshAllFeeds();
  } catch (err) {
    console.error('Manual refresh error:', err);
  }
};

module.exports = {
  getArticles,
  getStats,
  markRead,
  markAllRead,
  toggleBookmark,
  triggerRefresh,
};
