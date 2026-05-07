const { fetchRecentEarthquakes } = require('../services/usgsService');
const Aftershock = require('../models/Aftershock');
const Alert = require('../models/Alert');

// Mock data for sample display
const mockEarthquakes = [
  { magnitude: 5.2, depth: 35, place: "45km NE of Cox's Bazar", time: new Date().toISOString() },
  { magnitude: 4.8, depth: 20, place: "30km S of Sylhet", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { magnitude: 3.9, depth: 15, place: "10km W of Dhaka", time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
];

// Get recent earthquakes (real + mock fallback)
exports.getRecentEarthquakes = async (req, res) => {
  try {
    const quakes = await fetchRecentEarthquakes();
    if (quakes && quakes.length > 0) {
      return res.json(quakes);
    }
    // No real data – return mock
    return res.json(mockEarthquakes);
  } catch (err) {
    console.error('USGS error – sending mock data', err);
    return res.json(mockEarthquakes);
  }
};

// Get major historical earthquakes (from Alert model)
exports.getMajorEarthquakes = async (req, res) => {
  try {
    let majorQuakes = await Alert.find({ type: 'earthquake', active: false })
      .sort({ timestamp: -1 })
      .limit(10);
    if (majorQuakes.length === 0) {
      // Return a single sample major event
      return res.json([{
        _id: 'sample_major_1',
        title: "Magnitude 6.2 Earthquake - Chittagong",
        description: "Strong earthquake felt across Chittagong region.",
        level: "warning",
        upazila: "Chittagong Sadar",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        trigger: "Sample data for Sprint 4"
      }]);
    }
    res.json(majorQuakes);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

// Get aftershocks for a specific event
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

// Add an aftershock (manual)
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