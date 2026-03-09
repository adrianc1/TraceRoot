const express = require('express');
const brandsController = require('../controllers/brandsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.getAllBrands,
);
router.get('/create-brand', brandsController.createBrandForm);
router.post(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.createBrand,
);
router.get(
	'/:id/edit',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.editBrandForm,
);
router.put(
	'/:id',
	authorizeRole('admin', 'manager'),
	brandsController.updateBrand,
);

module.exports = router;
