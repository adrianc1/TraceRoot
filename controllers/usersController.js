const db = require('../db/queries');
const crypto = require('crypto');

const getUsers = async (req, res) => {
	try {
		const users = await db.getUsersByCompany(req.user.company_id);
		const pendingInvites = await db.getPendingInvites(req.user.company_id);

		res.render('users/users', {
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

module.exports = {
	getUsers,
	getInviteForm,
	createInvite,
	getAcceptInvite,
	acceptInvite,
};
