import express from 'express';
import { Router } from 'express';
import { tracyCoordinator } from '../controllers/tracyController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';
import { validateTracyQuestion } from '../middleware/tracyQuestionMiddleware';

const router: Router = express.Router();

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager'),
	validateTracyQuestion,
	tracyCoordinator,
);

export default router;
