const express = require('express');
const { protect } = require('../middleware/auth');
const { getOverview, getTrending, generateDigest } = require('../controllers/analyticsController');

const router = express.Router();
router.use(protect);

router.get('/overview', getOverview);
router.get('/trending', getTrending);
router.post('/digest', generateDigest);

module.exports = router;
