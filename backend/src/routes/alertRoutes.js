const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getActiveAlerts, getAlertHistory } = require('../controllers/alertController');

router.get('/active', verifyToken, getActiveAlerts);
router.get('/history', verifyToken, getAlertHistory);

module.exports = router;

const { runAlertEngine } = require('../services/alertService');
router.post('/manual', verifyToken, async (req, res) => {
  await runAlertEngine();
  res.json({ msg: 'Alert engine triggered' });
});