import express from 'express';
import { Router } from 'express';
import { tracyCoordinator } from '../controllers/tracyController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.post('/', authorizeRoleMiddleware('admin', 'manager'), tracyCoordinator);

export default router;
