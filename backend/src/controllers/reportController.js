const Report = require('../models/Report');
const Location = require('../models/Location');

// Submit a report (citizen)
exports.submitReport = async (req, res) => {
  try {
    const { type, title, description, lat, lng, upazila, photo } = req.body;
    const report = new Report({
      user: req.user.id,
      type,
      title,
      description,
      location: { type: 'Point', coordinates: [lng, lat] },
      upazila,
      photo
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all reports (with filters)
exports.getReports = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const reports = await Report.find(filter).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Admin: verify a report
exports.verifyReport = async (req, res) => {
  try {
    const { reportId, status } = req.body; // status: 'approved' or 'rejected'
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ msg: 'Report not found' });
    report.status = status;
    report.verifiedBy = req.user.id;
    report.verifiedAt = new Date();
    await report.save();
    // If approved, optionally update risk score for the upazila
    if (status === 'approved') {
      const location = await Location.findOne({ name: report.upazila, type: 'upazila' });
      if (location) {
        // Increase risk score slightly (mock)
        location.riskScore = Math.min(100, location.riskScore + 5);
        await location.save();
      }
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};