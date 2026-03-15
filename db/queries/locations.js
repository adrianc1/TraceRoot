const pool = require('../pool');

const getLocations = async (company_id) => {
	const { rows } = await pool.query(
		`SELECT id, name FROM locations
         WHERE company_id = $1 AND is_active = true
         ORDER BY name`,
		[company_id],
	);
	return rows;
};

const getAllLocations = async (companyId) => {
	const { rows } = await pool.query(
		`SELECT * FROM locations WHERE company_id = $1 ORDER BY name`,
		[companyId],
	);
	return rows;
};

const getLocationById = async (id, companyId) => {
	const { rows } = await pool.query(
		`SELECT * FROM locations WHERE id = $1 AND company_id = $2`,
		[id, companyId],
	);
	return rows[0];
};

const insertLocation = async (name, description, companyId) => {
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

const updateLocation = async (name, description, isActive, id, companyId) => {
	try {
		const { rows } = await pool.query(
			`UPDATE locations SET name = $1, description = $2, is_active = $3, updated_at = NOW()
			WHERE id = $4 AND company_id = $5`,
			[name, description, isActive, id, companyId],
		);
		return rows;
	} catch (error) {
		throw error;
	}
};

module.exports = { getLocations, getAllLocations, getLocationById, insertLocation, updateLocation };
