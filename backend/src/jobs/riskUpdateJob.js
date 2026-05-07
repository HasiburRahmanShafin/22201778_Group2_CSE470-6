const cron = require('node-cron');
const { updateAllRiskScores } = require('../controllers/locationController');

// Run every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Running risk score update job');
  updateAllRiskScores();
});