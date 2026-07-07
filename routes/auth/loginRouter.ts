import express from 'express';
import { Router } from 'express';
import { authController } from '../../controllers/authController';
import passport from 'passport';

const router: Router = express.Router();

router.get('/', authController.getLoginForm);
router.get('/demo', authController.demoLogin);

router.post(
	'/',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true,
	}),
);

export default router;
