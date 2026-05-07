const mongoose = require('mongoose');

const resourceRequestSchema = new mongoose.Schema({
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter', required: true },
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  fulfilled: { type: Number, default: 0 },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('ResourceRequest', resourceRequestSchema);