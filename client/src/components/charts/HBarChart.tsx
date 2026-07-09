import { useState } from 'react';

export interface BarDatum {
	label: string;
	value: number;
}

interface HBarChartProps {
	data: BarDatum[];
	color: string; // magnitude job → one hue
	formatValue: (n: number) => string;
}

// Rendered in HTML/CSS (not SVG) so the label/value text stays a constant
// size regardless of the card's width — only the bars flex responsively.
const HBarChart = ({ data, color, formatValue }: HBarChartProps) => {
	const [hovered, setHovered] = useState<number | null>(null);

	if (data.length === 0) {
		return <p className="text-sm text-gray-500 py-10 text-center">No data yet</p>;
	}

	const max = Math.max(...data.map((d) => d.value), 1);

	return (
		<div className="flex flex-col gap-1.5">
			{data.map((d, i) => {
				const pct = Math.max((d.value / max) * 100, d.value > 0 ? 2 : 0);
				const dim = hovered !== null && hovered !== i;
				return (
					<div
						key={d.label}
						className="flex items-center gap-3 py-1 transition-opacity"
						style={{ opacity: dim ? 0.4 : 1 }}
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
						title={`${d.label}: ${formatValue(d.value)}`}
					>
						<span className="w-24 shrink-0 text-right text-[0.8125rem] text-gray-600 capitalize truncate">
							{d.label}
						</span>
						<div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full rounded-full transition-all"
								style={{ width: `${pct}%`, backgroundColor: color }}
							/>
						</div>
						<span className="w-20 shrink-0 text-[0.8125rem] font-medium text-gray-900 tabular-nums">
							{formatValue(d.value)}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export default HBarChart;
