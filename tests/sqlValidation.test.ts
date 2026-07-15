import { isSafeSql } from '../utils/sqlValidation';

describe('isSafeSql - allows legitimate read-only queries', () => {
	test.each([
		['a plain SELECT', 'SELECT count(*) FROM packages'],
		['lowercase SQL', 'select * from products'],
		['a legitimate CTE', 'WITH t AS (SELECT * FROM packages) SELECT * FROM t'],
		['a column named updated_at', 'SELECT id, updated_at FROM packages'],
		['a column named created_at', 'SELECT id, created_at FROM products'],
	])('allows %s', (_label, sql) => {
		expect(isSafeSql(sql)).toBe(true);
	});
});

describe('isSafeSql - blocks unsafe queries', () => {
	test.each([
		['an empty string', ''],
		['stacked statements', 'SELECT 1; DROP TABLE packages'],
		['a bare write', 'DELETE FROM packages WHERE id = 1'],
		[
			'a write hidden in a CTE',
			'WITH d AS (DELETE FROM packages RETURNING *) SELECT * FROM d',
		],
		[
			'a schema-qualified system table',
			'SELECT tablename FROM pg_catalog.pg_tables',
		],
		['an unqualified system table', 'SELECT tablename FROM pg_tables'],
		['an uppercased system table', 'SELECT tablename FROM PG_TABLES'],
		['information_schema', 'SELECT * FROM information_schema.columns'],
	])('blocks %s', (_label, sql) => {
		expect(isSafeSql(sql)).toBe(false);
	});
});
