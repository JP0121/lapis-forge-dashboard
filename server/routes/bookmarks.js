const express = require('express');
const { protect } = require('../middleware/auth');
const { getBookmarks, upsertMeta } = require('../controllers/bookmarksController');

const router = express.Router();
router.use(protect);

router.get('/', getBookmarks);
router.put('/:articleId/meta', upsertMeta);

module.exports = router;
