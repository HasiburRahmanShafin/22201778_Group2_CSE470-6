const RiverStation = require('../models/RiverStation');

// Get all river stations
exports.getRiverStations = async (req, res) => {
  try {
    const stations = await RiverStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get list of upazilas where currentLevel > dangerLevel
exports.getAffectedUpazilas = async (req, res) => {
  try {
    const affected = await RiverStation.find({
      $expr: { $gt: ['$currentLevel', '$dangerLevel'] }
    }).select('upazila -_id');
    const upazilas = affected.map(s => s.upazila);
    res.json(upazilas);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};