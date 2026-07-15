export const formatCell = (val: unknown): string | number => {
	const ISO_DATE =
		/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

	// regex to check if string returned from postgres is a number
	const NUMERIC_STRING = /^-?\d+(\.\d+)?$/;

	if (val == null) {
		return '-';
	}
	if (typeof val === 'boolean') {
		return val ? 'Yes' : 'No';
	}

	if (typeof val === 'string') {
		if (NUMERIC_STRING.test(val as string)) {
			const num = Number(val);
			return num;
		}
		if (ISO_DATE.test(val as string)) {
			const date = new Date(val as string);
			if (!Number.isNaN(date.getTime())) {
				return date.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				});
			}
		}
		return val;
	}

	return JSON.stringify(val);
};
