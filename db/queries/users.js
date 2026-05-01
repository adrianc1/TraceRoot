const pool = require('../pool');
const bcrypt = require('bcryptjs');

const getUsersByCompany = async (company_id) => {
	const { rows } = await pool.query(
		`SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.created_at, c.name AS company_name
         FROM users u
         JOIN companies c ON u.company_id = c.id
         WHERE u.company_id = $1
         ORDER BY u.created_at ASC`,
		[company_id],
	);
	return rows;
};

const getUserById = async (id, company_id) => {
	const { rows } = await pool.query(
		`SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.created_at, c.name AS company_name
         FROM users u
         JOIN companies c ON u.company_id = c.id
         WHERE u.id = $1 AND u.company_id = $2`,
		[id, company_id],
	);
	return rows[0];
};

const updateUserRole = async (id, company_id, role) => {
	const { rows } = await pool.query(
		`UPDATE users u SET role = $1
         WHERE u.id = $2 AND u.company_id = $3
         RETURNING id`,
		[role, id, company_id],
	);
	return rows[0];
};

module.exports = { getUsersByCompany, getUserById, updateUserRole };
