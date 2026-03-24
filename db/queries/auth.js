const pool = require('../pool');

const signupAdmin = async (
	firstName,
	lastName,
	email,
	password_hash,
	companyName,
	licenseNumber,
	role = 'admin',
) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const companyResult = await client.query(
			`INSERT INTO companies(name, license_number) VALUES ($1, $2) RETURNING id `,
			[companyName, licenseNumber],
		);

		const companyId = companyResult.rows[0].id;

		const { rows } = await client.query(
			`
		INSERT INTO users (first_name, last_name, email, password_hash, company_id, role) VALUES ($1, $2, $3, $4, $5, $6) 
		`,
			[firstName, lastName, email, password_hash, companyId, role],
		);

		await client.query('COMMIT');
		return rows[0];
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};

const getUserByEmail = async (email) => {
	const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [
		email,
	]);
	return rows[0];
};

const getCompanyByName = async (name) => {
	const { rows } = await pool.query(
		'SELECT id FROM companies WHERE LOWER(name) = LOWER($1)',
		[name],
	);
	return rows[0];
};

const getCompanyById = async (id) => {
	const { rows } = await pool.query(
		'SELECT id, name FROM companies WHERE id = $1',
		[id],
	);
	return rows[0];
};

module.exports = { signupAdmin, getUserByEmail, getCompanyByName, getCompanyById };
