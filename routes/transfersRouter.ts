import express, { Router } from 'express';
import { transfersController } from '../controllers/transfersController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	transfersController.getAllTransfers,
);

router.get(
	'/export',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	transfersController.exportTransfersCsv,
);

router.post(
	'/',
	authorizeRoleMiddleware('admin', 'manager'),
	transfersController.createTransfer,
);

router.put(
	'/:id/confirm',
	authorizeRoleMiddleware('admin', 'manager'),
	transfersController.confirmTransfer,
);

router.put(
	'/:id/cancel',
	authorizeRoleMiddleware('admin', 'manager'),
	transfersController.cancelTransfer,
);

router.get(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	transfersController.getTransfer,
);

export default router;
