// builds a CSV string from an array of data objects and column defin
function toCsv(rows, columns) {
	const escape = (val) => {
		const str = val == null ? '' : String(val);
		if (
			str.includes(',') ||
			str.includes('"') ||
			str.includes('\n') ||
			str.includes('\r')
		) {
			return '"' + str.replace(/"/g, '""') + '"';
		}
		return str;
	};

	const header = columns.map((c) => escape(c.header)).join(',');

	const lines = rows.map((row) =>
		columns
			.map((c) => {
				const val = typeof c.value === 'function' ? c.value(row) : row[c.value];
				return escape(val);
			})
			.join(','),
	);

	return [header, ...lines].join('\r\n');
}

// sets headers and sends csv string as a file downlaod res
function sendCsv(res, filename, csvString) {
	res.setHeader('Content-Type', 'text/csv; charset=utf-8');
	res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
	res.send(csvString);
}

module.exports = { toCsv, sendCsv };
