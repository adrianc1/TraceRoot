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

module.exports = { getUsersByCompany };
