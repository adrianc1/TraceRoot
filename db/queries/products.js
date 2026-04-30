const pool = require('../pool');

const getAllProductsDB = async (user_id, status = 'active') => {
	try {
		const { rows } = await pool.query(
			`
      SELECT
        p.id,
        p.name,
        p.description,
        p.unit,
        p.status,
        p.category_id,
        brands.name AS brand_name,
        categories.name AS category_name,
        strains.name AS strain_name,
        COALESCE(SUM(i.quantity),0) AS product_qty,
        COALESCE(SUM(i.quantity * COALESCE(i.cost_price,0)),0)::FLOAT AS total_valuation,
        CASE
          WHEN SUM(i.quantity) > 0 THEN ROUND(SUM(i.quantity * COALESCE(i.cost_price,0)) / SUM(i.quantity), 2)
          ELSE 0
        END::FLOAT AS average_cost
      FROM products AS p
      LEFT JOIN brands ON p.brand_id = brands.id
      LEFT JOIN categories ON p.category_id = categories.id
      LEFT JOIN strains ON p.strain_id = strains.id
      LEFT JOIN packages AS i ON p.id = i.product_id
      WHERE p.company_id=$1 AND p.status=$2
      GROUP BY
        p.id,
        p.name,
        p.description,
        p.unit,
        p.status,
        p.category_id,
        brand_name,
        category_name,
        strain_name
      `,
			[user_id, status],
		);
		return rows;
	} catch (error) {
		console.error('Database error', error);
		throw error;
	}
};

const getProductWithInventoryDB = async (id, companyId) => {
	try {
		const { rows } = await pool.query(
			`
      SELECT
        p.id,
        p.name,
        p.description,
        p.sku,
        p.unit,
        p.brand_id,
        p.category_id,
        p.strain_id,
        p.status,
        brands.name AS brand_name,
        categories.name AS category_name,
        strains.name AS strain_name,
        COALESCE(SUM(i.quantity),0) AS total_quantity,
        COALESCE(SUM(i.quantity * i.cost_price),0) AS total_valuation,
        CASE
          WHEN SUM(i.quantity) > 0 THEN ROUND(SUM(i.quantity * i.cost_price) / SUM(i.quantity), 2)
          ELSE 0
        END AS average_cost
      FROM products p
      LEFT JOIN brands ON p.brand_id = brands.id
      LEFT JOIN categories ON p.category_id = categories.id
      LEFT JOIN strains ON p.strain_id = strains.id
      LEFT JOIN packages i ON p.id = i.product_id
      WHERE p.id = $1 AND p.company_id = $2
      GROUP BY p.id, p.name, p.sku, p.unit, p.brand_id, p.category_id, p.strain_id, brand_name, category_name, strain_name
      `,
			[id, companyId],
		);
		return rows[0];
	} catch (error) {
		throw error;
	}
};

const getProductDB = async (id, companyId) => {
	try {
		const { rows } = await pool.query(
			`SELECT 
            p.id,
            p.name,
            p.description,
            p.sku,
            p.unit,
            p.brand_id,
            p.category_id,
            p.strain_id,
            p.status,
            brands.name AS brand_name,
            categories.name AS category_name,
            strains.name AS strain_name
            FROM products AS p
            LEFT JOIN brands ON p.brand_id = brands.id
            LEFT JOIN categories ON p.category_id = categories.id
            LEFT JOIN strains ON p.strain_id = strains.id
            WHERE p.id = $1
            AND p.company_id=$2`,
			[id, companyId],
		);
		return rows[0];
	} catch (error) {
		throw error;
	}
};

const insertProduct = async (
	name,
	description,
	unit,
	brandId,
	strainId,
	categoryId,
	userCompanyId,
	sku,
	quantity = 0,
	// batchId,
) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(
			`INSERT INTO products (name, description, unit, brand_id, strain_id, category_id, company_id, sku)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
			[
				name,
				description,
				unit,
				brandId,
				strainId,
				categoryId,
				userCompanyId,
				sku,
			],
		);
		const product = result.rows[0];

		// await client.query(
		// 	`INSERT INTO packages (product_id, company_id, quantity, batch_id) VALUES ($1, $2, $3, $4)`,
		// 	[product.id, userCompanyId, quantity, batchId],
		// );
		await client.query('COMMIT');
		return product;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
};

const updateProduct = async (
	name,
	description,
	unit,
	company_id,
	brandId,
	strainId,
	categoryId,
	id,
	sku,
) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const product = await client.query(
			`UPDATE products 
   SET name = $1, 
       description = $2, 
       unit = $3, 
       brand_id = $4, 
       strain_id = $5, 
       category_id = $6,
       company_id = $7,
       sku = $8
        WHERE id = $9
                `,
			[
				name,
				description,
				unit,
				brandId,
				strainId,
				categoryId,
				company_id,
				sku,
				id,
			],
		);

		await client.query('COMMIT');
		return product;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};

const checkIfProductHasPackages = async (id) => {
	const { rows } = await pool.query(
		`SELECT COUNT(*) FROM packages WHERE product_id = $1`,
		[id],
	);
	return rows;
};

// Archive Product
const deleteProduct = async (productId, companyId) => {
	const product = await pool.query(
		`UPDATE products
        SET status= 'archived'
        WHERE id = $1
        AND company_id =$2
        AND NOT EXISTS (
        SELECT 1 FROM packages
        WHERE product_id = $1
        AND quantity > 0
        AND status = 'active'
        )`,
		[productId, companyId],
	);
	return product;
};

const unarchiveProduct = async (productId, companyId) => {
	const { rows } = await pool.query(
		`UPDATE products
        SET status = 'active'
        WHERE id = $1
        AND company_id =$2`,
		[productId, companyId],
	);

	return rows;
};

const activePackages = async (id) => {
	const { rows } = await pool.query(
		`SELECT COUNT(*) FROM packages WHERE product_id=$1 AND quantity > 0 AND status = 'active'`,
		[id],
	);
	return rows;
};

module.exports = {
	activePackages,
	unarchiveProduct,
	deleteProduct,
	checkIfProductHasPackages,
	updateProduct,
	insertProduct,
	getAllProductsDB,
	getProductDB,
	getProductWithInventoryDB,
};
