import { Response } from 'express';

interface CsvColumn {
	header: string;
	value: string | ((row: any) => any);
}

function toCsv(rows: Record<string, any>[], columns: CsvColumn[]) {
	const escape = (val: any) => {
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

	const header: any = columns.map((c) => escape(c.header)).join(',');

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
function sendCsv(res: Response, filename: string, csvString: string) {
	res.setHeader('Content-Type', 'text/csv; charset=utf-8');
	res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
	res.send(csvString);
}

export { toCsv, sendCsv };
