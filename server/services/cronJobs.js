const cron = require('node-cron');
const { refreshAllFeeds } = require('./feedParser');

let isRefreshing = false;

// Guard against overlapping runs
const safeRefresh = async () => {
  if (isRefreshing) {
    console.log('[Cron] Feed refresh already in progress, skipping.');
    return;
  }
  isRefreshing = true;
  try {
    await refreshAllFeeds();
  } finally {
    isRefreshing = false;
  }
};

const startCronJobs = () => {
  // Refresh every 20 minutes
  cron.schedule('*/20 * * * *', () => {
    console.log('[Cron] Scheduled feed refresh triggered');
    safeRefresh();
  });

  console.log('[Cron] Scheduler started — feeds refresh every 20 minutes');

  // Run immediately on startup so data is available right away
  console.log('[Cron] Running initial feed refresh on startup...');
  safeRefresh();
};

module.exports = { startCronJobs };
