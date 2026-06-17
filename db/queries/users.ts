import pool from '../pool';
import { Users, UserWithCompany } from '../../types';
import { AuthUser } from '../../types/express';
const getUsersByCompany = async (
	company_id: number,
): Promise<UserWithCompany[]> => {
	const { rows } = await pool.query<UserWithCompany>(
		`SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.active, u.created_at, c.name AS company_name
         FROM users u
         JOIN companies c ON u.company_id = c.id
         WHERE u.company_id = $1
         ORDER BY u.active DESC, u.created_at ASC`,
		[company_id],
	);
	return rows;
};

const getUserById = async (
	id: number,
	company_id: number,
): Promise<UserWithCompany | null> => {
	const { rows } = await pool.query<UserWithCompany>(
		`SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.active, u.created_at, c.name AS company_name
         FROM users u
         JOIN companies c ON u.company_id = c.id
         WHERE u.id = $1 AND u.company_id = $2`,
		[id, company_id],
	);
	return rows[0];
};

const updateUserRole = async (
	id: number,
	company_id: number,
	role: string,
): Promise<Users> => {
	const { rows } = await pool.query<Users>(
		`UPDATE users u SET role = $1
         WHERE u.id = $2 AND u.company_id = $3
         RETURNING id`,
		[role, id, company_id],
	);
	return rows[0];
};

const reactivateUser = async (
	id: number,
	company_id: number,
): Promise<Users> => {
	const { rows } = await pool.query<Users>(
		`UPDATE users SET active = true
         WHERE id = $1 AND company_id = $2
         RETURNING id`,
		[id, company_id],
	);
	return rows[0];
};

const deactivateUser = async (
	id: number,
	company_id: number,
): Promise<Users> => {
	const { rows } = await pool.query<Users>(
		`UPDATE users SET active = false
         WHERE id = $1 AND company_id = $2
         RETURNING id`,
		[id, company_id],
	);
	return rows[0];
};

export {
	getUsersByCompany,
	getUserById,
	updateUserRole,
	reactivateUser,
	deactivateUser,
};
