const db = require('../db/queries');
const crypto = require('crypto');

const getCurrentUser = async (req, res) => {
	try {
		const user = await db.getUserById(req.user.id, req.user.company_id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await db.getUsersByCompany(req.user.company_id);
		const pendingInvites = await db.getPendingInvites(req.user.company_id);

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

const getInviteForm = async (req, res) => {
	res.render('users/invite', { link: null });
};

const createInvite = async (req, res) => {
	try {
		const { email, role } = req.body;
		const token = crypto.randomBytes(32).toString('hex');
		const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);

		await db.createInvite({
			company_id: req.user.company_id,
			email,
			role,
			token,
			expires_at,
			created_by: req.user.id,
		});

		const link = `${req.protocol}://${req.get('host')}/signup/accept-invite?token=${token}`;

		res.render('users/invite', { link });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getAcceptInvite = async (req, res) => {
	try {
		const invite = await db.getInviteByToken(req.query.token);

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

const acceptInvite = async (req, res) => {
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

		if (password !== confirm_password) {
			return res.render('users/accept-invite', {
				invite,
				error: 'Passwords do not match',
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

const getEditUser = async (req, res) => {
	try {
		const user = await db.getUserById(req.params.id, req.user.company_id);
		if (!user) return res.status(404).send('User not found');
		res.render('users/edit-user', { editUser: user, currentUser: req.user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const updateUser = async (req, res) => {
	try {
		const { role } = req.body;
		const updated = await db.updateUserRole(
			req.params.id,
			req.user.company_id,
			role,
		);
		if (!updated) return res.status(404).send('User not found');
		res.redirect('/users');
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getAccount = async (req, res) => {
	const company = await db.getCompanyById(req.user.company_id);
	res.render('users/account', {
		user: req.user,
		companyName: company ? company.name : '',
	});
};

const getSettings = async (req, res) => {
	const billing = await db.getCompanyBilling(req.user.company_id);
	res.json({ user: req.user, billing });
};

module.exports = {
	getCurrentUser,
	getUsers,
	getInviteForm,
	createInvite,
	getAcceptInvite,
	acceptInvite,
	getEditUser,
	updateUser,
	getAccount,
	getSettings,
};
