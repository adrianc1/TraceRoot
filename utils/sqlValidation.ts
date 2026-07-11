export const sqlValidation = (sql: string): boolean => {
	const isValidSemicolon = semicolonValidation(sql);

	if (!isValidSemicolon) {
		return false;
	}
	return true;
};

const semicolonValidation = (sql: string) => {
	// check if only one semi-colon in generated sql, and that it is at the end of the string
	const trimmed = sql.trim();
	const withoutTrailing = trimmed.replace(/;\s*$/, '');
	return !withoutTrailing.includes(';');
};
