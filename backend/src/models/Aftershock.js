const mongoose = require('mongoose');

const aftershockSchema = new mongoose.Schema({
  mainEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert', required: true },
  magnitude: { type: Number, required: true },
  depth: { type: Number, required: true },
  epicenter: { type: String, required: true },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Aftershock', aftershockSchema);