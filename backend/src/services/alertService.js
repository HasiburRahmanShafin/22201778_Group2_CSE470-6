const Alert = require('../models/Alert');
const User = require('../models/User');
const riverStations = require('../../data/riverStations.json');
const { fetchRecentEarthquakes } = require('./usgsService');
const { sendAlertEmail } = require('./emailService');
const { getIo } = require('./ioService');

function getFloodLevel(current, danger) {
  const diff = current - danger;
  if (diff >= 1.0) return 'emergency';
  if (diff >= 0.5) return 'warning';
  return 'watch';
}

function getEarthquakeLevel(magnitude) {
  if (magnitude >= 6.5) return 'emergency';
  if (magnitude >= 5.5) return 'warning';
  return 'watch';
}

async function evaluateFloodRules() {
  for (const station of riverStations) {
    if (station.currentLevel > station.dangerLevel) {
      const level = getFloodLevel(station.currentLevel, station.dangerLevel);
      const existing = await Alert.findOne({ upazila: station.upazila, type: 'flood', active: true });
      if (existing) continue;

      const alert = new Alert({
        title: `Flood Alert in ${station.upazila}`,
        description: `Water level at ${station.name} is ${station.currentLevel}m (danger: ${station.dangerLevel}m). ${level === 'emergency' ? 'Immediate evacuation may be required.' : 'Monitor local updates.'}`,
        type: 'flood',
        level,
        upazila: station.upazila,
        trigger: `River level ${station.currentLevel}m > danger ${station.dangerLevel}m`,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      await alert.save();
      await notifyUsersForUpazila(alert);
    }
  }
}

async function evaluateEarthquakeRules() {
  const quakes = await fetchRecentEarthquakes();
  for (const quake of quakes) {
    if (quake.magnitude >= 5.0) {
      let targetUpazila = null;
      if (quake.place.includes('Cox')) targetUpazila = "Cox's Bazar Sadar";
      else if (quake.place.includes('Sylhet')) targetUpazila = "Sylhet Sadar";
      else if (quake.place.includes('Chittagong')) targetUpazila = "Chittagong Sadar";
      else targetUpazila = "Dhaka Sadar";

      const existing = await Alert.findOne({ upazila: targetUpazila, type: 'earthquake', active: true });
      if (existing) continue;

      const level = getEarthquakeLevel(quake.magnitude);
      const alert = new Alert({
        title: `Earthquake Alert - M${quake.magnitude}`,
        description: `A ${quake.magnitude} magnitude earthquake was detected near ${quake.place}. ${level === 'emergency' ? 'Take cover immediately.' : 'Stay cautious.'}`,
        type: 'earthquake',
        level,
        upazila: targetUpazila,
        trigger: `Magnitude ${quake.magnitude} within 150km of ${targetUpazila}`,
        expiry: new Date(Date.now() + 12 * 60 * 60 * 1000)
      });
      await alert.save();
      await notifyUsersForUpazila(alert);
    }
  }
}

async function notifyUsersForUpazila(alert) {
  const users = await User.find({ preferredUpazilas: alert.upazila });
  if (users.length === 0) return;
  const io = getIo();  // use top-level constant
  for (const user of users) {
    io.to(user._id.toString()).emit('newAlert', {
      alert,
      message: `New ${alert.level.toUpperCase()} alert: ${alert.title}`
    });
    if (user.alertPreferences?.emailNotifications) {
      await sendAlertEmail(user.email, alert);
    }
  }
  console.log(`Notified ${users.length} users for alert on ${alert.upazila}`);
}

async function deactivateExpiredAlerts() {
  const result = await Alert.updateMany(
    { expiry: { $lt: new Date() }, active: true },
    { active: false }
  );
  if (result.modifiedCount) console.log(`Deactivated ${result.modifiedCount} alerts`);
}

async function runAlertEngine() {
  console.log('🔄 Running alert engine...', new Date().toISOString());
  await evaluateFloodRules();
  await evaluateEarthquakeRules();
  await deactivateExpiredAlerts();
  console.log('✅ Alert engine finished');
}

module.exports = { runAlertEngine };