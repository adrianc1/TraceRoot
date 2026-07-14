import { formatCell } from './formatCell';

const MAX_ROWS = 20;

const humanize = (column: string) =>
	column.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const DataTable = ({
	result,
}: {
	result: Record<string, unknown>[];
}) => {
	const columns: string[] = Object.keys(result[0]);
	const visible = result.slice(0, MAX_ROWS);

	return (
		<div className="w-full md:w-2/3 mb-6 rounded-lg border border-green-border bg-green-light">
			<div className="overflow-x-auto">
				<table className="w-full text-[0.8125rem]">
					<thead>
						<tr className="text-left border-b border-green-border">
							{columns.map((column, j) => (
								<th
									key={j}
									className="px-4 py-2.5 text-xs font-medium whitespace-nowrap text-green-mid"
								>
									{humanize(column)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{visible.map((row, i) => (
							<tr
								key={i}
								className="border-b border-green-border/50 last:border-0"
							>
								{columns.map((column, j) => (
									<td
										key={j}
										className="px-4 py-2.5 whitespace-nowrap text-green-deep tabular-nums"
									>
										{formatCell(row[column])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{result.length > MAX_ROWS && (
				<p className="px-4 py-2.5 text-xs text-green-mid border-t border-green-border">
					Showing {MAX_ROWS} of {result.length} rows
				</p>
			)}
		</div>
	);
};
