const mongoose = require('mongoose');

const riverStationSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  upazila: { type: String, required: true },
  currentLevel: { type: Number, required: true },
  dangerLevel: { type: Number, required: true },
  trend: { type: String, enum: ['rising', 'falling', 'stable'], default: 'stable' },
  upstreamRainfall: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

riverStationSchema.index({ upazila: 1 });

module.exports = mongoose.model('RiverStation', riverStationSchema);