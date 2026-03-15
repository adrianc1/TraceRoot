const express = require('express');
const locationsController = require('../controllers/locationsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get('/', authorizeRole('admin', 'manager', 'staff'), locationsController.getAllLocations);
router.get('/create-location', authorizeRole('admin', 'manager', 'staff'), locationsController.createLocationForm);
router.post('/', authorizeRole('admin', 'manager', 'staff'), locationsController.createLocation);
router.get('/:id/edit', authorizeRole('admin', 'manager', 'staff'), locationsController.editLocationForm);
router.put('/:id', authorizeRole('admin', 'manager'), locationsController.updateLocation);

module.exports = router;
