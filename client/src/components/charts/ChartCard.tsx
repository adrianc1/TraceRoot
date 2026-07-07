import { useState, type ReactNode } from 'react';

interface ChartCardProps {
	title: string;
	subtitle?: string;
	chart: ReactNode;
	table: ReactNode; // accessibility twin of the chart
	className?: string;
}

const ChartCard = ({
	title,
	subtitle,
	chart,
	table,
	className = '',
}: ChartCardProps) => {
	const [showTable, setShowTable] = useState(false);

	return (
		<figure
			className={`bg-white border border-gray-200 rounded-lg p-5 m-0 ${className}`}
		>
			<div className="flex items-start justify-between mb-4">
				<div>
					<figcaption className="text-sm font-semibold text-gray-900">
						{title}
					</figcaption>
					{subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
				</div>
				<button
					type="button"
					onClick={() => setShowTable(!showTable)}
					className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded px-2 py-1 transition-colors"
					aria-pressed={showTable}
				>
					{showTable ? 'Chart' : 'Table'}
				</button>
			</div>
			{showTable ? table : chart}
		</figure>
	);
};

export const ChartTable = ({
	headers,
	rows,
}: {
	headers: string[];
	rows: (string | number)[][];
}) => (
	<div className="overflow-x-auto">
		<table className="w-full text-sm">
			<thead>
				<tr className="text-left text-xs text-gray-500 border-b border-gray-200">
					{headers.map((h) => (
						<th key={h} className="py-2 pr-4 font-medium">
							{h}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, i) => (
					<tr key={i} className="border-b border-gray-100 last:border-0">
						{row.map((cell, j) => (
							<td
								key={j}
								className={`py-2 pr-4 ${j === 0 ? 'text-gray-900' : 'text-gray-600 tabular-nums'}`}
							>
								{cell}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default ChartCard;
