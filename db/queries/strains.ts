import pool from '../pool';
import type { Strain } from '../../types';

export const getAllStrains = async (companyId: number): Promise<Strain[]> => {
	const { rows } = await pool.query<Strain>(
		'SELECT * FROM strains WHERE company_id=$1',
		[companyId],
	);

	return rows;
};

export const getStrain = async (
	id: number,
	companyId: number,
): Promise<Strain | undefined> => {
	const { rows } = await pool.query<Strain>(
		'SELECT * FROM strains WHERE id = $1 AND company_id=$2',
		[id, companyId],
	);
	return rows[0];
};

export const insertStrain = async (
	name: string,
	companyId: number,
	description: string | null,
	type: string | null,
): Promise<Strain> => {
	const result = await pool.query<Strain>(
		`INSERT INTO strains (name, company_id, description, type) VALUES ($1, $2, $3, $4) RETURNING *`,
		[name, companyId, description, type],
	);
	return result.rows[0];
};

export const updateStrain = async (
	name: string,
	description: string,
	id: number,
): Promise<void> => {
	await pool.query<Strain>(
		`UPDATE strains
		SET name = $1,
		description = $2
		WHERE id = $3`,
		[name, description, id],
	);
};

export const deleteStrain = async (id: number): Promise<void> => {
	await pool.query<Strain>(`DELETE FROM strains WHERE id = $1`, [id]);
};
