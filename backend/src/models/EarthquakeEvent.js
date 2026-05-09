const mongoose = require('mongoose');

const earthquakeEventSchema = new mongoose.Schema({
  magnitude: { type: Number, required: true },
  depth: { type: Number },
  epicenter: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  place: { type: String },
  time: { type: Date, default: Date.now },
  upazila: { type: String } // nearest upazila (optional)
}, { timestamps: true });

module.exports = mongoose.model('EarthquakeEvent', earthquakeEventSchema);