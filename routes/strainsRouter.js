const express = require('express');
const strainsController = require('../controllers/strainsController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	strainsController.getAllStrains,
);

router.post(
	'/',
	authorizeRole('admin', 'manager', 'staff'),
	strainsController.insertStrain,
);
// router.get(
// 	'/:id/edit',
// 	authorizeRole('admin', 'manager', 'staff'),
// 	strainsController.editStrainForm,
// );
router.put(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	strainsController.updateStrain,
);
router.delete(
	'/:id',
	authorizeRole('admin', 'manager'),
	strainsController.deleteStrain,
);
router.get(
	'/:id',
	authorizeRole('admin', 'manager', 'staff'),
	strainsController.getStrain,
);

module.exports = router;
