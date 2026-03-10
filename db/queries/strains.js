const pool = require('../pool');

const getAllStrains = async (companyId) => {
	const { rows } = await pool.query(
		'SELECT * FROM strains WHERE company_id=$1',
		[companyId],
	);
	return rows;
};

const getStrain = async (id, companyId) => {
	try {
		const { rows } = await pool.query(
			`SELECT * FROM strains WHERE id=$1 AND company_id=$2`,
			[id, companyId],
		);
		return rows[0];
	} catch (error) {
		throw error;
	}
};

const insertStrain = async (name, companyId, description, type) => {
	try {
		const result = await pool.query(
			`INSERT INTO strains (name, company_id, description, type)
            VALUES ($1, $2, $3, $4) RETURNING *`,
			[name, companyId, description, type],
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
};

const updateStrain = async (name, description, id) => {
	const strain = await pool.query(
		`UPDATE strains
        SET name = $1,
        description = $2
        WHERE id = $3`,
		[name, description, id],
	);
};

const deleteStrain = async (id) => {
	const strain = await pool.query('DELETE FROM strains WHERE id = $1', [id]);
	return strain;
};

module.exports = {
	getAllStrains,
	getStrain,
	insertStrain,
	updateStrain,
	deleteStrain,
};
