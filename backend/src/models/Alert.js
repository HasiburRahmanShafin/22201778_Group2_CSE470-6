const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['flood', 'earthquake'], required: true },
  level: { type: String, enum: ['watch', 'warning', 'emergency'], required: true },
  upazila: { type: String, required: true },          // store upazila name, not ObjectId
  trigger: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);