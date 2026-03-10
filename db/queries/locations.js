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

module.exports = { getLocations };
