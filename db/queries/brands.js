const pool = require('../pool');

const getAllBrands = async (companyId) => {
	const { rows } = await pool.query(
		'SELECT * FROM brands WHERE company_id=$1',
		[companyId],
	);
	return rows;
};

const getBrand = async (brandId, companyId) => {
	const { rows } = await pool.query(
		`SELECT * FROM brands WHERE id=$1 AND company_id=$2 `,
		[brandId, companyId],
	);
	return rows[0];
};

const insertBrand = async (name, description, companyId) => {
	try {
		const result = await pool.query(
			`INSERT INTO brands (name, description, company_id)
            VALUES ($1, $2, $3) RETURNING *`,
			[name, description, companyId],
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
};

const getBrandById = async (id, companyId) => {
	const { rows } = await pool.query(
		`SELECT * FROM brands WHERE id=$1 AND company_id=$2`,
		[id, companyId],
	);

	return rows[0];
};

const updateBrand = async (name, description, id, companyId) => {
	try {
		const { rows } = await pool.query(
			`UPDATE brands SET name = $1, description = $2 WHERE id = $3 AND company_id = $4`,
			[name, description, id, companyId],
		);
		return rows;
	} catch (error) {
		throw new Error();
	}
};

module.exports = {
	getAllBrands,
	getBrand,
	insertBrand,
	getBrandById,
	updateBrand,
};
