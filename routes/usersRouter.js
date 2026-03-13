const express = require('express');
const usersController = require('../controllers/usersController');
const authorizeRole = require('../auth/authorizeRole.js');
const router = express.Router();

router.get('/', authorizeRole('admin'), usersController.getUsers);
router.get('/invite', authorizeRole('admin'), usersController.getInviteForm);
router.post('/invite', authorizeRole('admin'), usersController.createInvite);

module.exports = router;
