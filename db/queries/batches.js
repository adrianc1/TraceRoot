const pool = require('../pool');

const getBatchByNumber = async (product_id, batch_number) => {
	const { rows } = await pool.query(
		`SELECT * FROM batches WHERE product_id=$1 AND batch_number=$2`,
		[product_id, batch_number],
	);
	return rows[0] || null;
};

const createBatch = async ({
	product_id,
	company_id,
	batch_number,
	total_quantity,
	unit,
	cost_per_unit,
	supplier_name,
}) => {
	const { rows } = await pool.query(
		`INSERT INTO batches (product_id, company_id, batch_number, total_quantity, unit, cost_per_unit, supplier_name)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING *`,
		[
			product_id,
			company_id,
			batch_number,
			total_quantity,
			unit,
			cost_per_unit,
			supplier_name,
		],
	);
	return rows[0];
};

module.exports = { getBatchByNumber, createBatch };
