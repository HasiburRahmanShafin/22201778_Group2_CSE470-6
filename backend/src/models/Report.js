const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['flood', 'earthquake'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [long, lat]
  },
  upazila: { type: String, required: true },
  photo: { type: String }, // URL or file path
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Report', reportSchema);