import { Companies, Invites, Users, CreateInviteParams } from '../../types';
import { AuthUser } from '../../types/express';
import pool from '../pool';
import bcrypt from 'bcryptjs';

const createInvite = async ({
	company_id,
	email,
	role,
	token,
	expires_at,
	created_by,
}: CreateInviteParams): Promise<Invites> => {
	const { rows } = await pool.query<Invites>(
		`INSERT INTO invites (company_id, email, role, token, expires_at, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
		[company_id, email, role, token, expires_at, created_by],
	);
	return rows[0];
};

const getInviteByToken = async (token: string): Promise<Invites | null> => {
	const { rows } = await pool.query<Invites>(
		`SELECT * FROM invites WHERE token = $1`,
		[token],
	);
	return rows[0] || null;
};

const getPendingInvites = async (company_id: number): Promise<Invites[]> => {
	const { rows } = await pool.query<Invites>(
		`SELECT * FROM invites
         WHERE company_id = $1
         AND accepted_at IS NULL
         AND expires_at > NOW()
         ORDER BY created_at DESC`,
		[company_id],
	);
	return rows;
};

const markInviteAccepted = async (id: number): Promise<Invites> => {
	const { rows } = await pool.query<Invites>(
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
}: {
	company_id: number;
	email: string;
	role: string;
	first_name: string;
	last_name: string;
	password: string;
}): Promise<Users> => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const { rows } = await pool.query<Users>(
		`INSERT INTO users (company_id, email, role, first_name, last_name, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, role, first_name, last_name, company_id`,
		[company_id, email, role, first_name, last_name, hashedPassword],
	);
	return rows[0];
};

export {
	createInvite,
	getInviteByToken,
	getPendingInvites,
	markInviteAccepted,
	createUserFromInvite,
};
