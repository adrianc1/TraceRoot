import express from 'express';
import { Router } from 'express';
import { productsController } from '../controllers/productsController';
import { authorizeRoleMiddleware } from '../auth/authorizeRole';

const router: Router = express.Router();

router.get(
	'/',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.getAllPackages,
);
router.get(
	'/products',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.getProductsList,
);
router.get(
	'/create-product',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.createProductForm,
);
router.get(
	'/receive',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.receiveNewPackageForm,
);
router.post(
	'/receive',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.receiveNewPackagesPOST,
);

router.post(
	'/create-product',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.insertProduct,
);

router.get(
	'/export',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.exportPackagesCsv,
);

router.get(
	'/products/export',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.exportProductsCsv,
);

router.get(
	'/:id/receive',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.receiveInventoryGet,
);
router.post(
	'/:id/receive',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.receiveInventoryPut,
);

router.get(
	'/:id/edit',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.editProductForm,
);

router.get(
	'/:packageTag/split',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.splitPackageProductForm,
);
router.post(
	'/:packageTag/split',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.splitPackagePost,
);
router.put(
	'/:packageTag/adjust',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.updateInventory,
);
router.get(
	'/:packageTag/adjust',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.adjustInventoryGet,
);

router.put(
	'/:id/archive',
	authorizeRoleMiddleware('admin'),
	productsController.deleteProduct,
);

router.put(
	'/:id/unarchive',
	authorizeRoleMiddleware('admin'),
	productsController.unarchiveProduct,
);
router.get(
	'/:id/audit/export',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.exportAuditCsv,
);

router.get(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.getProduct,
);
router.put(
	'/:id',
	authorizeRoleMiddleware('admin', 'manager', 'staff'),
	productsController.updateProduct,
);

export default router;
