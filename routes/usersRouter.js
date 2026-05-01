const express = require('express');
const usersController = require('../controllers/usersController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get('/', authorizeRole('admin'), usersController.getUsers);
router.get('/me', usersController.getCurrentUser);
router.get('/account', usersController.getAccount);
router.get('/settings', usersController.getSettings);
router.get('/invite', authorizeRole('admin'), usersController.getInviteForm);
router.post('/invite', authorizeRole('admin'), usersController.createInvite);
router.get('/:id/edit', authorizeRole('admin'), usersController.getEditUser);
router.post('/:id/edit', authorizeRole('admin'), usersController.updateUser);

module.exports = router;
