import express, { Router } from 'express';
import { usersController } from '../controllers/usersController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get('/', authorizeRoleMiddleware('admin'), usersController.getUsers);
router.get('/me', usersController.getCurrentUser);
router.get('/account', usersController.getAccount);
router.get('/settings', usersController.getSettings);
router.get('/invite', authorizeRoleMiddleware('admin'), usersController.getInviteForm);
router.post('/invite', authorizeRoleMiddleware('admin'), usersController.createInvite);
router.get('/:id/edit', authorizeRoleMiddleware('admin'), usersController.getEditUser);
router.put('/:id/edit', authorizeRoleMiddleware('admin'), usersController.updateUser);
router.delete('/:id', authorizeRoleMiddleware('admin'), usersController.deactivateUser);
router.put('/:id/reactivate', authorizeRoleMiddleware('admin'), usersController.reactivateUser);

export default router;
