import tracyPool from '../tracyPool';

export const tracyQuery = async (
	sql: string,
	company_id: number,
): Promise<any[]> => {
	const client = await tracyPool.connect();

	try {
		await client.query('BEGIN');
		await client.query("SELECT set_config('app.company_id', $1, true)", [
			String(company_id),
		]);
		await client.query("SET LOCAL statement_timeout = '5s'");

		// run Claudes SQL
		const result = await client.query(sql);
		await client.query('COMMIT');
		return result.rows;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};
