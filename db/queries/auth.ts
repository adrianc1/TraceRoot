import pool from '../pool';
import { Companies, Users } from '../../types';
import { AuthUser } from '../../types/express';

export const signupAdmin = async (
	firstName: string,
	lastName: string,
	email: string,
	password_hash: string,
	companyName: string,
	licenseNumber: string,
	role = 'admin',
): Promise<Users> => {
	const client = await po9ol.connect();

	try {
		await client.query('BEGIN');

		const companyResult = await client.query<Pick<Companies, 'id'>>(
			`INSERT INTO companies(name, license_number) VALUES ($1, $2) RETURNING id `,
			[companyName, licenseNumber],
		);

		const companyId = companyResult.rows[0].id;

		const { rows } = await client.query<Users>(
			`
		INSERT INTO users (first_name, last_name, email, password_hash, company_id, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
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

export const getUserByEmail = async (
	email: string,
): Promise<AuthUser | undefined> => {
	const { rows } = await pool.query<AuthUser>(
		`SELECT * FROM users WHERE email=$1`,
		[email],
	);
	return rows[0];
};

export const getCompanyByName = async (
	name: string,
): Promise<Pick<Companies, 'id'> | undefined> => {
	const { rows } = await pool.query<Pick<Companies, 'id'>>(
		'SELECT id FROM companies WHERE LOWER(name) = LOWER($1)',
		[name],
	);
	return rows[0];
};

export const getCompanyById = async (
	id: number,
): Promise<Pick<Companies, 'id' | 'name'> | undefined> => {
	const { rows } = await pool.query<Pick<Companies, 'id' | 'name'>>(
		'SELECT id, name FROM companies WHERE id = $1',
		[id],
	);
	return rows[0];
};
