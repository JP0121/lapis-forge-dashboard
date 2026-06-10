const Alert = require('../models/Alert');

/**
 * Run keyword alerts against a batch of newly saved articles.
 * Called by feedParser after each refresh.
 */
const runAlertEngine = async (articles) => {
  if (!articles || articles.length === 0) return;

  try {
    const keywordAlerts = await Alert.find({ type: 'keyword', enabled: true });
    if (!keywordAlerts.length) return;

    for (const alert of keywordAlerts) {
      if (!alert.keyword) continue;

      const regex = new RegExp(alert.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const matches = articles.filter(
        (a) => regex.test(a.title) || regex.test(a.description || '')
      );

      if (matches.length > 0) {
        const newMatches = matches.map((a) => ({
          articleId: a._id,
          title: a.title,
          url: a.url,
          matchedAt: new Date(),
        }));

        // Keep only last 20 matches per alert
        const combined = [...(alert.recentMatches || []), ...newMatches];
        alert.recentMatches = combined.slice(-20);
        alert.lastTriggeredAt = new Date();
        alert.triggerCount = (alert.triggerCount || 0) + matches.length;
        await alert.save();
      }
    }
  } catch (err) {
    console.error('[AlertEngine] Error running alerts:', err.message);
  }
};

module.exports = { runAlertEngine };
