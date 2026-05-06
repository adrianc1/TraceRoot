const pool = require('../pool');

const getAllCategories = async (companyId) => {
	const { rows } = await pool.query(
		'SELECT * FROM categories WHERE company_id=$1',
		[companyId],
	);
	return rows;
};

const getCategoryById = async (id, companyId) => {
	const { rows } = await pool.query(
		`SELECT id, name, description FROM categories WHERE id=$1 AND company_id=$2`,
		[id, companyId],
	);
	return rows[0];
};

const getCategory = async (id, companyId) => {
	try {
		const { rows } = await pool.query(
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
            SUM(pk.quantity) AS total_quantity  -- useful to show total stock per product
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
	} catch (error) {
		throw error;
	}
};

const getSingleCategory = async (id, companyId) => {
	try {
		const { rows } = await pool.query(
			`
            SELECT id, name, description FROM categories WHERE id=$1 AND company_id=$2
            `,
			[id, companyId],
		);
		return rows[0];
	} catch (error) {
		console.error(error);
	}
};

const insertCategory = async (name, companyId, description) => {
	try {
		const result = await pool.query(
			`INSERT INTO categories (name, company_id, description)
            VALUES ($1, $2, $3) RETURNING *`,
			[name, companyId, description],
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
};

const updateCategory = async (name, description, id) => {
	const category = await pool.query(
		`UPDATE categories 
        SET name = $1,
        description = $2
        WHERE id = $3`,
		[name, description, id],
	);
};

const deleteCategory = async (categoryId) => {
	const category = await pool.query('DELETE FROM categories WHERE id = $1', [
		categoryId,
	]);
	return category;
};

module.exports = {
	getAllCategories,
	getCategoryById,
	getCategory,
	insertCategory,
	getSingleCategory,
	updateCategory,
	deleteCategory,
};
