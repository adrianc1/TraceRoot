import pool from '../pool';
import { Batch, Unit } from '../../types';

export const getBatchByNumber = async (
	product_id: number,
	batch_number: string | null,
): Promise<Batch | null> => {
	const { rows } = await pool.query<Batch>(
		`SELECT * FROM batches WHERE product_id=$1 AND batch_number=$2`,
		[product_id, batch_number],
	);
	return rows[0] || null;
};

export const createBatch = async ({
	product_id,
	company_id,
	batch_number,
	total_quantity,
	unit,
	cost_per_unit,
	supplier_name,
}: {
	product_id: number;
	company_id: number;
	batch_number: string | null;
	total_quantity: number;
	unit: Unit;
	cost_per_unit: number | null;
	supplier_name: string | null;
}): Promise<Batch> => {
	const { rows } = await pool.query<Batch>(
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
