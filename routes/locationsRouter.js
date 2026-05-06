const express = require('express');
const locationsController = require('../controllers/locationsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	locationsController.getAllLocations,
);

router.post(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	locationsController.createLocation,
);

router.put(
	'/:id',
	authorizeRole('admin', 'manager'),
	locationsController.updateLocation,
);

router.get(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	locationsController.getLocationById,
);
module.exports = router;
