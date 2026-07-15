import { formatCell } from './formatCell';
import { useState } from 'react';

const MAX_ROWS = 10;

const humanize = (column: string) =>
	column.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const DataTable = ({
	result,
}: {
	result: Record<string, unknown>[];
}) => {
	const columns: string[] = Object.keys(result[0]);

	const [currentPage, setCurrentPage] = useState<number>(0);
	const totalPages = Math.ceil(result.length / MAX_ROWS);
	const visible = result.slice(
		currentPage * MAX_ROWS,
		(currentPage + 1) * MAX_ROWS,
	);

	return (
		<div className="w-full mb-6 rounded-lg border border-green-border bg-green-light">
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
				<div className="flex items-center justify-between px-4 py-2.5 border-t border-green-border bg-green-light/50">
					<p className="text-xs text-green-mid">
						Page {currentPage + 1} of {totalPages}
					</p>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setCurrentPage((prev) => prev - 1)}
							disabled={currentPage === 0}
							className="px-3 py-1 text-xs font-medium text-green-mid bg-white border border-green-mid rounded-md hover:bg-green-deep hover:text-white hover:border-green-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-green-mid"
						>
							Prev
						</button>
						<button
							onClick={() => setCurrentPage((prev) => prev + 1)}
							disabled={currentPage >= totalPages - 1}
							className="px-3 py-1 text-xs font-medium text-green-mid bg-white border border-green-mid rounded-md hover:bg-green-deep hover:text-white hover:border-green-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-green-mid"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
