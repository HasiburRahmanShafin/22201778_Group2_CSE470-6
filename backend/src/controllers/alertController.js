const Alert = require('../models/Alert');

// Get active alerts (sorted: emergency first, then warning, then watch)
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ level: -1, timestamp: -1 });
    // Custom sort: emergency (3) > warning (2) > watch (1)
    const order = { emergency: 3, warning: 2, watch: 1 };
    alerts.sort((a, b) => order[b.level] - order[a.level] || b.timestamp - a.timestamp);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get alert history (paginated)
exports.getAlertHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const alerts = await Alert.find({ active: false })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Alert.countDocuments({ active: false });
    res.json({ alerts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};