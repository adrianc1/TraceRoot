import express from 'express';
import { Router } from 'express';
import { categoriesController } from '../controllers/categoriesController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	categoriesController.getAllCategories,
);

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	categoriesController.insertCategory,
);

router.put(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	categoriesController.updateCategory,
);
router.delete(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager'),
	categoriesController.deleteCategory,
);
router.get(
	'/:id/products',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	categoriesController.getProductsByCategory,
);
router.get(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	categoriesController.getCategory,
);

export default router;
