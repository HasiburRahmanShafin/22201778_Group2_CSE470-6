const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');
const shelterController = require('../controllers/shelterController');
const resourceController = require('../controllers/resourceController');

// Reports
router.post('/reports', verifyToken, reportController.submitReport);
router.get('/reports', verifyToken, reportController.getReports);
router.put('/reports/verify', verifyToken, authorizeRoles('admin'), reportController.verifyReport);

// Shelters
router.post('/shelters', verifyToken, authorizeRoles('admin'), shelterController.createShelter);
router.get('/shelters', verifyToken, shelterController.getShelters);
router.put('/shelters/:id', verifyToken, authorizeRoles('admin'), shelterController.updateShelter);
router.get('/shelters/nearby', verifyToken, shelterController.findNearestShelters);

// Resources
router.post('/resources', verifyToken, authorizeRoles('admin'), resourceController.createRequest);
router.get('/resources', verifyToken, resourceController.getRequests);
router.post('/resources/:requestId/offer', verifyToken, resourceController.offerHelp);

module.exports = router;