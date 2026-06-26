import express from 'express';
import { Router } from 'express';
import { locationsController } from '../controllers/locationsController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	locationsController.getAllLocations,
);

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	locationsController.createLocation,
);

router.put(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager'),
	locationsController.updateLocation,
);

router.get(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	locationsController.getLocationById,
);
export default router;
