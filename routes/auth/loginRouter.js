const express = require('express');
const authController = require('../../controllers/authController');
const passport = require('passport');
const router = express.Router();

router.get('/', authController.getLoginForm);
router.get('/demo', authController.demoLogin);

router.post(
	'/',
	passport.authenticate('local', {
		successRedirect: '/packages',
		failureRedirect: '/login',
		failureFlash: true,
	}),
);

module.exports = router;
