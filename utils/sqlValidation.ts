export const isSafeSql = (sql: string): boolean =>
	isSingleStatement(sql) &&
	startsWithSelectOrWith(sql) &&
	hasNoWriteKeywords(sql) &&
	avoidSystemTables(sql);

const isSingleStatement = (sql: string) => {
	const trimmed = sql.trim();
	const withoutTrailing = trimmed.replace(/;\s*$/, '');
	return !withoutTrailing.includes(';');
};

const startsWithSelectOrWith = (sql: string): boolean => {
	const trimmed = sql.trim().toUpperCase();
	return trimmed.startsWith('SELECT') || trimmed.startsWith('WITH');
};

const avoidSystemTables = (sql: string): boolean => {
	if (sql.toLowerCase().includes('information_schema')) {
		return false;
	}
	return !sql.toLowerCase().includes('pg_');
};

const hasNoWriteKeywords = (sql: string): boolean => {
	const writeKeywords = [
		'INSERT',
		'UPDATE',
		'DELETE',
		'CREATE',
		'DROP',
		'ALTER',
	];
	const regex = new RegExp(`\\b(${writeKeywords.join('|')})\\b`, 'i');
	return !regex.test(sql);
};
