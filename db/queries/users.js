const pool = require('../pool');
const bcrypt = require('bcryptjs');

const getUsersByCompany = async (company_id) => {
	const { rows } = await pool.query(
		`SELECT id, first_name, last_name, email, role, created_at
         FROM users
         WHERE company_id = $1
         ORDER BY created_at ASC`,
		[company_id],
	);
	return rows;
};

const getUserById = async (id, company_id) => {
	const { rows } = await pool.query(
		`SELECT id, first_name, last_name, email, role, created_at
         FROM users
         WHERE id = $1 AND company_id = $2`,
		[id, company_id],
	);
	return rows[0];
};

const updateUserRole = async (id, company_id, role) => {
	const { rows } = await pool.query(
		`UPDATE users SET role = $1
         WHERE id = $2 AND company_id = $3
         RETURNING id`,
		[role, id, company_id],
	);
	return rows[0];
};

module.exports = { getUsersByCompany, getUserById, updateUserRole };
