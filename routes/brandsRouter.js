const express = require('express');
const brandsController = require('../controllers/brandsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.getAllBrands,
);
router.get(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.getBrandById,
);
router.post(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.createBrand,
);
router.put(
	'/:id',
	authorizeRole('admin', 'manager'),
	brandsController.updateBrand,
);

module.exports = router;
