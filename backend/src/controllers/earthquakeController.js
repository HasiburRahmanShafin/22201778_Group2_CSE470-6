const { fetchRecentEarthquakes } = require('../services/usgsService');
const Aftershock = require('../models/Aftershock');
const Alert = require('../models/Alert');
const EarthquakeEvent = require('../models/EarthquakeEvent');

exports.getRecentEarthquakes = async (req, res) => {
  try {
    const quakes = await fetchRecentEarthquakes();
    res.json(quakes || []);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

exports.getMajorEarthquakes = async (req, res) => {
  try {
    const majorQuakes = await Alert.find({ type: 'earthquake', active: false })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(majorQuakes);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

exports.getAftershocks = async (req, res) => {
  try {
    const { eventId } = req.params;
    const aftershocks = await Aftershock.find({ mainEvent: eventId }).sort({ time: -1 });
    res.json(aftershocks);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

exports.addAftershock = async (req, res) => {
  try {
    const { mainEvent, magnitude, depth, epicenter } = req.body;
    const aftershock = new Aftershock({ mainEvent, magnitude, depth, epicenter });
    await aftershock.save();
    res.status(201).json(aftershock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.addManualEarthquake = async (req, res) => {
  try {
    const { magnitude, depth, lat, lng, place } = req.body;
    // Optionally store in a separate collection; for now, just trigger engine
    const { runAlertEngine } = require('../services/alertService');
    await runAlertEngine();
    res.status(201).json({ msg: 'Earthquake event processed', magnitude, place });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};