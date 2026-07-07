import { useState } from 'react';
import { INK } from './chartTheme';

export interface BarDatum {
	label: string;
	value: number;
}

interface HBarChartProps {
	data: BarDatum[];
	color: string; // magnitude job → one hue
	formatValue: (n: number) => string;
}

const ROW_H = 32;
const BAR_H = 14;
const LABEL_W = 110;
const VALUE_W = 76;

const HBarChart = ({ data, color, formatValue }: HBarChartProps) => {
	const [hovered, setHovered] = useState<number | null>(null);

	if (data.length === 0) {
		return <p className="text-sm text-gray-500 py-10 text-center">No data yet</p>;
	}

	const max = Math.max(...data.map((d) => d.value), 1);
	const width = 480;
	const plotW = width - LABEL_W - VALUE_W;
	const height = data.length * ROW_H;

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className="w-full"
			role="img"
			aria-label="Bar chart"
		>
			{data.map((d, i) => {
				const y = i * ROW_H;
				const w = Math.max((d.value / max) * plotW, d.value > 0 ? 3 : 0);
				const dim = hovered !== null && hovered !== i;
				return (
					<g
						key={d.label}
						opacity={dim ? 0.4 : 1}
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
					>
						{/* oversize hit target */}
						<rect x={0} y={y} width={width} height={ROW_H} fill="transparent" />
						<text
							x={LABEL_W - 8}
							y={y + ROW_H / 2}
							textAnchor="end"
							dominantBaseline="middle"
							fontSize={12}
							fill={INK.secondary}
						>
							{d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label}
						</text>
						<line
							x1={LABEL_W}
							y1={y + ROW_H / 2}
							x2={LABEL_W + plotW}
							y2={y + ROW_H / 2}
							stroke={INK.grid}
							strokeWidth={1}
						/>
						<rect
							x={LABEL_W}
							y={y + (ROW_H - BAR_H) / 2}
							width={w}
							height={BAR_H}
							rx={4}
							fill={color}
						>
							<title>{`${d.label}: ${formatValue(d.value)}`}</title>
						</rect>
						<text
							x={LABEL_W + w + 6}
							y={y + ROW_H / 2}
							dominantBaseline="middle"
							fontSize={12}
							fill={INK.primary}
							className="tabular-nums"
						>
							{formatValue(d.value)}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

export default HBarChart;
