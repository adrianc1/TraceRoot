import express from 'express';
import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	dashboardController.getDashboardStats,
);

export default router;
