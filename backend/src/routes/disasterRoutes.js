const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getDisasterHistory } = require('../controllers/disasterController');

router.get('/', verifyToken, getDisasterHistory);

module.exports = router;