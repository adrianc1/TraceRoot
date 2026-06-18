import express from 'express';
import { Router } from 'express';
import { brandsController } from '../controllers/brandsController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	brandsController.getAllBrands,
);
router.get(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	brandsController.getBrandById,
);
router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	brandsController.createBrand,
);
router.put(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager'),
	brandsController.updateBrand,
);
router.delete(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager'),
	brandsController.deleteBrand,
);

export default router;
