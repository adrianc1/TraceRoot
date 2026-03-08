const express = require('express');
const brandsController = require('../controllers/brandsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	brandsController.getAllBrands,
);
// router.get('/create-brand', brandsController.createBrandForm);
// router.post('/create-brand', brandsController.insertBrand);
// router.get('/:id/edit', brandsController.editBrandForm);
// router.put('/:id', brandsController.updateBrand);
// router.delete('/:id', brandsController.deleteBrand);
// router.get('/:id', brandsController.getBrand);

module.exports = router;
