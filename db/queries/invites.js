const pool = require('../pool');
const bcrypt = require('bcryptjs');

const createInvite = async ({
	company_id,
	email,
	role,
	token,
	expires_at,
	created_by,
}) => {
	const { rows } = await pool.query(
		`INSERT INTO invites (company_id, email, role, token, expires_at, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
		[company_id, email, role, token, expires_at, created_by],
	);
	return rows[0];
};

const getInviteByToken = async (token) => {
	const { rows } = await pool.query(`SELECT * FROM invites WHERE token = $1`, [
		token,
	]);
	return rows[0] || null;
};

const getPendingInvites = async (company_id) => {
	const { rows } = await pool.query(
		`SELECT * FROM invites
         WHERE company_id = $1
         AND accepted_at IS NULL
         AND expires_at > NOW()
         ORDER BY created_at DESC`,
		[company_id],
	);
	return rows;
};

const markInviteAccepted = async (id) => {
	const { rows } = await pool.query(
		`UPDATE invites
         SET accepted_at = NOW()
         WHERE id = $1
         RETURNING *`,
		[id],
	);
	return rows[0];
};

const createUserFromInvite = async ({
	company_id,
	email,
	role,
	first_name,
	last_name,
	password,
}) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const { rows } = await pool.query(
		`INSERT INTO users (company_id, email, role, first_name, last_name, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, role, first_name, last_name`,
		[company_id, email, role, first_name, last_name, hashedPassword],
	);
	return rows[0];
};

module.exports = {
	createInvite,
	getInviteByToken,
	getPendingInvites,
	markInviteAccepted,
	createUserFromInvite,
};
