import express from 'express';
import { Router } from 'express';
import { strainsController } from '../controllers/strainsController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	strainsController.getAllStrains,
);

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	strainsController.insertStrain,
);

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	strainsController.getAllStrains,
);

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	strainsController.insertStrain,
);

router.put(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	strainsController.updateStrain,
);
router.delete(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager'),
	strainsController.deleteStrain,
);
router.get(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	strainsController.getStrain,
);

export default router;
