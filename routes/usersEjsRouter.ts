import express, { Router } from 'express';
import { usersController } from '../controllers/usersController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get('/invite', authorizeRoleMiddleware('admin'), usersController.getInviteForm);
router.post('/invite', authorizeRoleMiddleware('admin'), usersController.createInvite);

export default router;
