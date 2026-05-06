const express = require('express');
const productsController = require('../controllers/productsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.getAllPackages,
);
router.get(
	'/products',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.getProductsList,
);
router.get(
	'/create-product',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.createProductForm,
);
router.get(
	'/receive',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.receiveNewPackageForm,
);
router.post(
	'/receive',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.receiveNewPackagesPOST,
);

router.post(
	'/create-product',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.insertProduct,
);

router.get(
	'/export',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.exportPackagesCsv,
);

router.get(
	'/products/export',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.exportProductsCsv,
);

router.get(
	'/:id/receive',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.receiveInventoryGet,
);
router.post(
	'/:id/receive',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.receiveInventoryPut,
);

router.get(
	'/:id/edit',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.editProductForm,
);

router.get(
	'/:packageTag/split',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.splitPackageProductForm,
);
router.post(
	'/:packageTag/split',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.splitPackagePost,
);
router.put(
	'/:packageTag/adjust',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.updateInventory,
);
router.get(
	'/:packageTag/adjust',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.adjustInventoryGet,
);

router.put(
	'/:id/archive',
	authorizeRole('admin'),
	productsController.deleteProduct,
);

router.put(
	'/:id/unarchive',
	authorizeRole('admin'),
	productsController.unarchiveProduct,
);
router.get(
	'/:id/audit/export',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.exportAuditCsv,
);

router.get(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.getProduct,
);
router.put(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.updateProduct,
);

module.exports = router;
