import pool from '../../db/pool';
import type { Location } from '../../types';

export const getLocations = async (company_id: number): Promise<Location[]> => {
	const { rows } = await pool.query(
		`SELECT id, name FROM locations
         WHERE company_id = $1 AND is_active = true
         ORDER BY name`,
		[company_id],
	);
	return rows;
};

export const getAllLocations = async (
	companyId: number,
): Promise<Location[]> => {
	const { rows } = await pool.query(
		`SELECT * FROM locations WHERE company_id = $1 ORDER BY name`,
		[companyId],
	);
	return rows;
};

export const getLocationById = async (
	id: number,
	companyId: number,
): Promise<Location> => {
	const { rows } = await pool.query(
		`SELECT * FROM locations WHERE id = $1 AND company_id = $2`,
		[id, companyId],
	);
	return rows[0];
};

export const insertLocation = async (
	name: string,
	description: string | undefined,
	companyId: number,
): Promise<Location> => {
	try {
		const result = await pool.query(
			`INSERT INTO locations (name, description, company_id)
			VALUES ($1, $2, $3) RETURNING *`,
			[name, description, companyId],
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
};

export const updateLocation = async (
	name: string,
	description: string | null,
	isActive: boolean,
	id: number,
	companyId: number,
): Promise<void> => {
	try {
		await pool.query(
			`UPDATE locations SET name = $1, description = $2, is_active = $3, updated_at = NOW()
			WHERE id = $4 AND company_id = $5`,
			[name, description, isActive, id, companyId],
		);
	} catch (error) {
		throw error;
	}
};
