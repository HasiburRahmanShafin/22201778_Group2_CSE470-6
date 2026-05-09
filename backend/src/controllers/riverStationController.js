const RiverStation = require('../models/RiverStation');

exports.getAllStations = async (req, res) => {
  try {
    const stations = await RiverStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.createStation = async (req, res) => {
  try {
    const station = new RiverStation(req.body);
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await RiverStation.findByIdAndUpdate(id, req.body, { new: true });
    if (!station) return res.status(404).json({ msg: 'Station not found' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteStation = async (req, res) => {
  try {
    await RiverStation.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Station deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};