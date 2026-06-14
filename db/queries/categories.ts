import pool from '../pool';
import type { Category, ProductWithDetails } from '../../types';

export const getAllCategories = async (
	companyId: number,
): Promise<Category[]> => {
	const { rows } = await pool.query<Category>(
		'SELECT * FROM categories WHERE company_id=$1',
		[companyId],
	);
	return rows;
};

export const getCategoryById = async (
	id: number,
	companyId: number,
): Promise<Category | undefined> => {
	const { rows } = await pool.query<Category>(
		`SELECT id, name, description FROM categories WHERE id=$1 AND company_id=$2`,
		[id, companyId],
	);
	return rows[0];
};

export const getCategory = async (
	id: number,
	companyId: number,
): Promise<ProductWithDetails[]> => {
	const { rows } = await pool.query<ProductWithDetails>(
		`SELECT 
            p.id,
            p.name,
            p.description,
            p.unit,
            p.category_id,
            p.sku,
            p.status,
            b.name AS brand_name,
            c.name AS category_name,
            s.name AS strain_name,
            SUM(pk.quantity)::FLOAT AS total_quantity
            FROM products AS p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN strains s ON p.strain_id = s.id
            LEFT JOIN packages pk ON p.id = pk.product_id AND pk.status = 'active'
            WHERE p.category_id = $1
            AND p.company_id = $2
            GROUP BY p.id, b.name, c.name, s.name
            ORDER BY p.name`,
		[id, companyId],
	);
	return rows;
};

export const insertCategory = async (
	name: string,
	companyId: number,
	description: string | null,
): Promise<Category> => {
	try {
		const result = await pool.query<Category>(
			`INSERT INTO categories (name, company_id, description)
            VALUES ($1, $2, $3) RETURNING *`,
			[name, companyId, description],
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
};

export const updateCategory = async (
	name: string,
	description: string | null,
	id: number,
): Promise<void> => {
	await pool.query(
		`UPDATE categories 
        SET name = $1,
        description = $2
        WHERE id = $3`,
		[name, description, id],
	);
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
	await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);
};
