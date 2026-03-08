const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.getAllCategories,
);
router.get(
	'/create-category',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.createCategoryForm,
);
router.post(
	'/create-category',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.insertCategory,
);
router.get(
	'/:id/edit',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.editCategoryForm,
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
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	categoriesController.getCategory,
);

module.exports = router;
