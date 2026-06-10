const Article = require('../models/Article');
const BookmarkMeta = require('../models/BookmarkMeta');

// GET /api/bookmarks
const getBookmarks = async (req, res) => {
  try {
    const { tag, search, page = 1 } = req.query;
    const PAGE_SIZE = 24;

    // Get all bookmarked article IDs that have meta matching filters
    let metaFilter = {};
    if (tag) metaFilter.tags = tag;
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      metaFilter.$or = [
        { notes: { $regex: escaped, $options: 'i' } },
        { tags: { $regex: escaped, $options: 'i' } },
      ];
    }

    const metas = await BookmarkMeta.find(metaFilter).lean();
    const metaMap = {};
    metas.forEach((m) => { metaMap[m.articleId.toString()] = m; });

    const articleFilter = { isBookmarked: true };
    if (metas.length > 0 && (tag || search)) {
      articleFilter._id = { $in: metas.map((m) => m.articleId) };
    }
    if (search && !tag) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      articleFilter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const skip = (pageNum - 1) * PAGE_SIZE;

    const [articles, total] = await Promise.all([
      Article.find(articleFilter).sort({ updatedAt: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
      Article.countDocuments(articleFilter),
    ]);

    // Attach meta to each article
    const enriched = articles.map((a) => ({
      ...a,
      meta: metaMap[a._id.toString()] || { tags: [], notes: '' },
    }));

    // Get all unique tags across bookmarks
    const allMetas = await BookmarkMeta.find().lean();
    const allTags = [...new Set(allMetas.flatMap((m) => m.tags))].filter(Boolean).sort();

    res.json({
      articles: enriched,
      allTags,
      pagination: {
        page: pageNum,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
        hasMore: skip + articles.length < total,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
};

// PUT /api/bookmarks/:articleId/meta
const upsertMeta = async (req, res) => {
  try {
    const { tags, notes } = req.body;
    const meta = await BookmarkMeta.findOneAndUpdate(
      { articleId: req.params.articleId },
      { $set: { tags: tags || [], notes: notes || '' } },
      { upsert: true, new: true }
    );
    res.json({ meta });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bookmark meta' });
  }
};

module.exports = { getBookmarks, upsertMeta };
