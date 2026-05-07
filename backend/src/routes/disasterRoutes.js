const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Existing controller (disaster history)
const { getDisasterHistory } = require('../controllers/disasterController');

// New controllers for Sprint 4
const floodController = require('../controllers/floodController');
const earthquakeController = require('../controllers/earthquakeController');
const forecastController = require('../controllers/forecastController');
const timelineController = require('../controllers/timelineController');

// ----- Existing route -----
router.get('/', verifyToken, getDisasterHistory);

// ----- Flood Monitoring -----
router.get('/river-stations', verifyToken, floodController.getRiverStations);
router.get('/affected-upazilas', verifyToken, floodController.getAffectedUpazilas);

// ----- Earthquake Tracker & Aftershocks -----
router.get('/earthquakes/recent', verifyToken, earthquakeController.getRecentEarthquakes);
router.get('/earthquakes/major', verifyToken, earthquakeController.getMajorEarthquakes);
router.get('/earthquakes/aftershocks/:eventId', verifyToken, earthquakeController.getAftershocks);
router.post('/earthquakes/aftershocks', verifyToken, earthquakeController.addAftershock);  // admin/manual

// ----- Flood Forecasting -----
router.get('/flood-forecast', verifyToken, forecastController.getFloodForecast);

// ----- Multi‑Disaster Timeline (includes alerts + manual events) -----
router.get('/timeline', verifyToken, timelineController.getTimeline);

module.exports = router;