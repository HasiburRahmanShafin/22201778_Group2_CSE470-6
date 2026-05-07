const Alert = require('../models/Alert');

// Mock for cyclone/heatwave (later could be added to DB)
const manualEvents = [
  {
    type: 'cyclone',
    title: 'Cyclone Amphan',
    description: 'Severe cyclone hit Sundarbans region.',
    severity: 'severe',
    date: '2023-05-20',
    upazila: 'Shyamnagar'
  },
  {
    type: 'heatwave',
    title: 'Heatwave in Rajshahi',
    description: 'Temperatures exceeded 40°C for five consecutive days.',
    severity: 'moderate',
    date: '2024-04-15',
    upazila: 'Rajshahi Sadar'
  }
];

exports.getTimeline = async (req, res) => {
  try {
    // Get alerts that are past or active (but we'll show all with date)
    const alerts = await Alert.find({ active: false }).select('title description type level upazila timestamp').lean();
    const formattedAlerts = alerts.map(a => ({
      type: a.type,
      title: a.title,
      description: a.description,
      severity: a.level,
      date: a.timestamp,
      upazila: a.upazila
    }));
    const combined = [...formattedAlerts, ...manualEvents];
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(combined);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};