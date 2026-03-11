const express = require('express');
const transfersController = require('../controllers/transfersController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	transfersController.getAllTransfers,
);

router.get(
	'/create',
	authorizeRole('admin', 'manager'),
	transfersController.createTransferForm,
);

router.post(
	'/',
	authorizeRole('admin', 'manager'),
	transfersController.createTransfer,
);

router.put(
	'/:id/confirm',
	authorizeRole('admin', 'manager'),
	transfersController.confirmTransfer,
);

router.put(
	'/:id/cancel',
	authorizeRole('admin', 'manager'),
	transfersController.cancelTransfer,
);

router.get(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	transfersController.getTransfer,
);

module.exports = router;
