const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['flood', 'earthquake', 'both'], default: 'both' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  upazila: { type: String, required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  contact: { type: String, required: true },
  status: { type: String, enum: ['open', 'full', 'closed'], default: 'open' },
  facilities: [String]
}, { timestamps: true });

shelterSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Shelter', shelterSchema);