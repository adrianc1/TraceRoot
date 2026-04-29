const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.getAllCategories,
);

router.post(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.insertCategory,
);

router.put(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.updateCategory,
);
router.delete(
	'/:id',
	authorizeRole('admin', 'manager'),
	categoriesController.deleteCategory,
);
router.get(
	'/:id/products',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.getProductsByCategory,
);
router.get(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.getCategory,
);

module.exports = router;
