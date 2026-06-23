const { syncEncarListings } = require("./encarService");

// Calculate ms until next 6:00 AM
const getMsUntil6AM = () => {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    6, // Hour: 6 AM
    0, // Minute: 0
    0, // Second: 0
    0  // Millisecond: 0
  );
  if (now.getTime() >= target.getTime()) {
    // If it's already past 6:00 AM today, set for 6:00 AM tomorrow
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
};

const runSync = async () => {
  console.log(`[Scheduler] ${new Date().toISOString()} - Running scheduled daily sync of 30 cars...`);
  try {
    // Sync 30 domestic cars, sorting by ModifiedDate (newest first)
    const result = await syncEncarListings(30, true, "ModifiedDate", 1);
    console.log(`[Scheduler] Daily sync completed: imported ${result.importedCount}, skipped ${result.skippedCount}`);
  } catch (error) {
    console.error(`[Scheduler] Daily sync failed:`, error.message);
  }
};

const initScheduler = () => {
  const delay = getMsUntil6AM();
  const targetTimeStr = new Date(Date.now() + delay).toLocaleString();
  console.log(`[Scheduler] Daily sync scheduled. First run will be at: ${targetTimeStr}`);
  
  setTimeout(() => {
    runSync();
    // After first run, repeat every 24 hours
    setInterval(runSync, 24 * 60 * 60 * 1000);
  }, delay);
};

module.exports = { initScheduler };
