const express = require('express');
const productsController = require('../controllers/productsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.getAllProducts,
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
	'/:id/split/:lotNumber',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.splitPackageProductForm,
);
router.post(
	'/:id/split/:lotNumber',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.splitPackagePost,
);
router.put(
	'/:id/adjust/:lotNumber',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.updateInventory,
);
router.get(
	'/:id/adjust/:lotNumber',
	authorizeRole('admin', 'manager', 'staff'),
	productsController.adjustInventoryGet,
);

router.delete('/:id', authorizeRole('admin'), productsController.deleteProduct);
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
