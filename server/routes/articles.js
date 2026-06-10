const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getArticles,
  getStats,
  markRead,
  markAllRead,
  toggleBookmark,
  triggerRefresh,
} = require('../controllers/articlesController');

const router = express.Router();

// All article routes require authentication
router.use(protect);

router.get('/', getArticles);
router.get('/stats', getStats);
router.patch('/mark-all-read', markAllRead);
router.patch('/:id/read', markRead);
router.patch('/:id/bookmark', toggleBookmark);
router.post('/refresh', triggerRefresh);

module.exports = router;
