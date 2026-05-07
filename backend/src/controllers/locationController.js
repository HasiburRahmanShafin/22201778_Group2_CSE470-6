const Location = require('../models/Location');

// Get all locations (with optional filters)
exports.getLocations = async (req, res) => {
  try {
    const { type, parent, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (parent) filter.parent = parent;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const locations = await Location.find(filter).populate('parent', 'name type');
    res.json(locations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get a single location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate('parent');
    if (!location) return res.status(404).json({ msg: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Compute risk score for a location
exports.computeRisk = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ msg: 'Location not found' });
    let risk = 0;
    if (location.seismicZone === 'high') risk += 40;
    else if (location.seismicZone === 'moderate') risk += 20;
    if (location.floodProne) risk += 30;
    risk = Math.min(100, risk + Math.floor(Math.random() * 20));
    location.riskScore = risk;
    await location.save();
    res.json({ riskScore: risk });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update all risk scores (cron job)
exports.updateAllRiskScores = async () => {
  const locations = await Location.find();
  for (let loc of locations) {
    let risk = 0;
    if (loc.seismicZone === 'high') risk += 40;
    else if (loc.seismicZone === 'moderate') risk += 20;
    if (loc.floodProne) risk += 30;
    risk = Math.min(100, risk + Math.floor(Math.random() * 20));
    loc.riskScore = risk;
    await loc.save();
  }
  console.log('All risk scores updated');
};

// Get risk summary (top risky districts)
exports.getRiskSummary = async (req, res) => {
  try {
    const topRisky = await Location.find({ type: 'district' })
      .sort({ riskScore: -1 })
      .limit(5)
      .select('name riskScore');
    res.json(topRisky);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// SEARCH ENDPOINT – for upazila autocomplete
exports.searchLocations = async (req, res) => {
  try {
    const { q, type } = req.query;
    console.log(`[search] query: "${q}", type: "${type}"`); // debug
    if (!q || q.length < 2) {
      return res.json([]);
    }
    const filter = { name: { $regex: q, $options: 'i' } };
    if (type) filter.type = type;
    const locations = await Location.find(filter).limit(20);
    console.log(`[search] found ${locations.length} results`); // debug
    res.json(locations);
  } catch (err) {
    console.error('[search] ERROR:', err);
    res.status(500).json({ msg: err.message, stack: err.stack });
  }
};