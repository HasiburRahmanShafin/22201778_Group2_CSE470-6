const riverStations = require('../../data/riverStationsDetailed.json');

exports.getRiverStations = (req, res) => {
  res.json(riverStations);
};

exports.getAffectedUpazilas = (req, res) => {
  const affected = riverStations
    .filter(s => s.currentLevel > s.dangerLevel)
    .map(s => s.upazila);
  res.json(affected);
};