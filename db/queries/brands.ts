import pool from '../pool';
import type { Brand } from '../../types';

export const getAllBrands = async (companyId: number): Promise<Brand[]> => {
	const { rows } = await pool.query<Brand>(
		'SELECT * FROM brands WHERE company_id=$1',
		[companyId],
	);
	return rows;
};

export const getBrand = async (
	brandId: number,
	companyId: number,
): Promise<Brand | undefined> => {
	const { rows } = await pool.query<Brand>(
		`SELECT * FROM brands WHERE id=$1 AND company_id=$2 `,
		[brandId, companyId],
	);
	return rows[0];
};

export const insertBrand = async (
	name: string,
	description: string | null,
	companyId: number,
): Promise<Brand> => {
	const { rows } = await pool.query<Brand>(
		`INSERT INTO brands (name, description, company_id)
            VALUES ($1, $2, $3) RETURNING *`,
		[name, description, companyId],
	);
	return rows[0];
};

export const getBrandById = async (
	id: number,
	companyId: number,
): Promise<Brand | undefined> => {
	const { rows } = await pool.query<Brand>(
		`SELECT * FROM brands WHERE id=$1 AND company_id=$2`,
		[id, companyId],
	);
	return rows[0];
};

export const updateBrand = async (
	name: string,
	description: string | null,
	id: number,
	companyId: number,
): Promise<void> => {
	await pool.query(
		`UPDATE brands SET name = $1, description = $2 WHERE id = $3 AND company_id = $4`,
		[name, description, id, companyId],
	);
};

export const deleteBrand = async (id: number): Promise<void> => {
	await pool.query(`DELETE FROM brands WHERE id = $1`, [id]);
};
