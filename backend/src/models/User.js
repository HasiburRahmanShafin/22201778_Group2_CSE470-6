const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, default: '' },
  preferredUpazilas: [{ type: String }],
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  alertPreferences: {
    floodAlerts: { type: Boolean, default: true },
    earthquakeAlerts: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: false },
    smsNotifications: { type: Boolean, default: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);