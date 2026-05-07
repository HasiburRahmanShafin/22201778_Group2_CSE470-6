const ResourceRequest = require('../models/ResourceRequest');

// Admin: post a resource request
exports.createRequest = async (req, res) => {
  try {
    const resource = new ResourceRequest({ ...req.body, postedBy: req.user.id });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all active requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await ResourceRequest.find({ status: 'active' }).populate('shelter', 'name location upazila');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Citizen: offer help (mock – just increase fulfilled count or log)
exports.offerHelp = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await ResourceRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    // For demo, increase fulfilled by 1 (or accept custom quantity)
    request.fulfilled = Math.min(parseInt(request.quantity.match(/\d+/) || 0), request.fulfilled + 1);
    if (request.fulfilled >= parseInt(request.quantity.match(/\d+/) || 0)) request.status = 'fulfilled';
    await request.save();
    res.json({ msg: 'Help offered! Shelter will contact you.' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};