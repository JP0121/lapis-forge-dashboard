const express = require('express');
const { protect } = require('../middleware/auth');
const { getAlerts, createAlert, updateAlert, deleteAlert, clearMatches } = require('../controllers/alertsController');

const router = express.Router();
router.use(protect);

router.get('/', getAlerts);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);
router.patch('/:id/clear', clearMatches);

module.exports = router;
