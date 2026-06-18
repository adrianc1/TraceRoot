import express from 'express';
import { Router, Request, Response } from 'express';
import { authController } from '../../controllers/authController';
import { usersController } from '../../controllers/usersController';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.render('index');
});

router.get('/signup/create-account', authController.getSignUpForm);
router.get('/logout', (req: Request, res: Response) => {
	req.logout((err) => {
		if (err) console.error(err);
		res.redirect('/login');
	});
});

router.get('/accept-invite', usersController.getAcceptInvite);
router.post('/accept-invite', usersController.acceptInvite);
router.post(
	'/signup/create-account',
	authController.validateUser,
	authController.postSignUpForm,
);

export default router;
