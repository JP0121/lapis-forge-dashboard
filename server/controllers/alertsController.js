const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
};

const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ alert });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create alert' });
  }
};

const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json({ alert });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update alert' });
  }
};

const deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete alert' });
  }
};

const clearMatches = async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, {
      $set: { recentMatches: [], triggerCount: 0 },
    });
    res.json({ message: 'Matches cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear matches' });
  }
};

module.exports = { getAlerts, createAlert, updateAlert, deleteAlert, clearMatches };
