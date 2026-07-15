import 'dotenv/config';
import { Pool } from 'pg';

const tracyPool = new Pool({
	connectionString: `postgresql://${process.env.TRACY_DB_USER}:${process.env.TRACY_DB_PASSWORD}@${process.env.TRACY_DB_HOST}:${process.env.TRACY_DB_PORT}/${process.env.TRACY_DB_NAME}`,
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: false,
});

export = tracyPool;
