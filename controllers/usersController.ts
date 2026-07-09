import { Request, Response } from 'express';
import * as db from '../db/queries';
import crypto from 'crypto';
import { validateUser } from './authController';
const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const user = await db.getUserById(req.user!.id, req.user!.company_id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await db.getUsersByCompany(req.user!.company_id);
		const pendingInvites = await db.getPendingInvites(req.user!.company_id);

		res.json({
			users,
			pendingInvites,
			currentUser: req.user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getInviteForm = async (req: Request, res: Response) => {
	res.render('users/invite', { link: null });
};

const createInvite = async (req: Request, res: Response) => {
	try {
		const { email, role } = req.body;
		const token = crypto.randomBytes(32).toString('hex');
		const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);

		await db.createInvite({
			company_id: req.user!.company_id,
			email,
			role,
			token,
			expires_at,
			created_by: req.user!.id,
		});

		const baseUrl =
			process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
		const link = `${baseUrl}/accept-invite?token=${token}`;

		res.render('users/invite', { link });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getAcceptInvite = async (req: Request, res: Response) => {
	try {
		const invite = await db.getInviteByToken(req.query.token as string);

		if (
			!invite ||
			invite.accepted_at ||
			new Date() > new Date(invite.expires_at)
		) {
			return res.render('users/invite-invalid');
		}

		res.render('users/accept-invite', { invite });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const acceptInvite = async (req: Request, res: Response) => {
	try {
		const { token, first_name, last_name, password, confirm_password } =
			req.body;
		const invite = await db.getInviteByToken(token);

		if (
			!invite ||
			invite.accepted_at ||
			new Date() > new Date(invite.expires_at)
		) {
			return res.render('users/invite-invalid');
		}

		// password errors
		if (password !== confirm_password) {
			return res.render('users/accept-invite', {
				invite,
				error: 'Passwords do not match',
			});
		} else if (password.length < 8) {
			return res.render('users/accept-invite', {
				invite,
				error: 'Password must be at least 8 characters long',
			});
		}

		await db.createUserFromInvite({
			company_id: invite.company_id,
			email: invite.email,
			role: invite.role,
			first_name,
			last_name,
			password,
		});

		await db.markInviteAccepted(invite.id);

		res.redirect('/login');
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getEditUser = async (req: Request, res: Response) => {
	try {
		const user = await db.getUserById(
			Number(req.params.id),
			req.user!.company_id,
		);
		if (!user) return res.status(404).send('User not found');
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const { role } = req.body;
		const updated = await db.updateUserRole(
			Number(req.params.id),
			req.user!.company_id,
			role,
		);
		if (!updated) return res.status(404).json({ error: 'User not found' });
		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const reactivateUser = async (req: Request, res: Response) => {
	try {
		const reactivated = await db.reactivateUser(
			Number(req.params.id),
			req.user!.company_id,
		);
		if (!reactivated) return res.status(404).json({ error: 'User not found' });
		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const deactivateUser = async (req: Request, res: Response) => {
	try {
		if (req.params.id === String(req.user!.id)) {
			return res
				.status(400)
				.json({ error: 'Cannot deactivate your own account' });
		}
		const deactivated = await db.deactivateUser(
			Number(req.params.id),
			req.user!.company_id,
		);
		if (!deactivated) return res.status(404).json({ error: 'User not found' });
		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getAccount = async (req: Request, res: Response) => {
	const company = await db.getCompanyById(req.user!.company_id);
	res.json('users/account');
};

const getSettings = async (req: Request, res: Response) => {
	const billing = await db.getCompanyBilling(req.user!.company_id);
	res.json({ user: req.user, billing });
};

export {
	getCurrentUser,
	getUsers,
	getInviteForm,
	createInvite,
	getAcceptInvite,
	acceptInvite,
	getEditUser,
	updateUser,
	reactivateUser,
	deactivateUser,
	getAccount,
	getSettings,
};

export const usersController = {
	getCurrentUser,
	getUsers,
	getInviteForm,
	createInvite,
	getAcceptInvite,
	acceptInvite,
	getEditUser,
	updateUser,
	reactivateUser,
	deactivateUser,
	getAccount,
	getSettings,
};
