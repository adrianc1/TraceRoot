import express from 'express';
import { Router } from 'express';
import {
	tracyCoordinator,
	validateTracyQuestion,
} from '../controllers/tracyController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager'),
	validateTracyQuestion,
	tracyCoordinator,
);

export default router;
