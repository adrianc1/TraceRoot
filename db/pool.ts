import { Pool } from 'pg';

const pool = new Pool({
	connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: false,
});

export = pool;
