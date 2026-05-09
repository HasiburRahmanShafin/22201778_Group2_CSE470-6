const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const riverStationController = require('../controllers/riverStationController');
const earthquakeController = require('../controllers/earthquakeController');

router.use(verifyToken, authorizeRoles('admin'));

router.get('/river-stations', riverStationController.getAllStations);
router.post('/river-stations', riverStationController.createStation);
router.put('/river-stations/:id', riverStationController.updateStation);
router.delete('/river-stations/:id', riverStationController.deleteStation);
router.post('/earthquakes', earthquakeController.addManualEarthquake);

module.exports = router;