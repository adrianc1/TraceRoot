import tracyPool from '../tracyPool';

export const tracyQuery = async (
	sql: string,
	company_id: number,
): Promise<any[]> => {
	const client = await tracyPool.connect();
	const MAX_ROWS = 500;
	const sanitized = sql.trim().replace(/;\s*$/, '');
	const capped = `SELECT * FROM (${sanitized}) AS tracy_result LIMIT $1`;

	try {
		await client.query('BEGIN');
		await client.query("SELECT set_config('app.company_id', $1, true)", [
			String(company_id),
		]);
		await client.query("SET LOCAL statement_timeout = '5s'");

		// run Claudes SQL
		const result = await client.query(capped, [MAX_ROWS]);
		await client.query('COMMIT');
		return result.rows;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};
