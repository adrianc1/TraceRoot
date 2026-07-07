import { useRef, useState } from 'react';
import { INK } from './chartTheme';

export interface LinePoint {
	label: string; // x label (e.g. date)
	value: number;
}

interface LineChartProps {
	data: LinePoint[];
	color: string;
	formatValue: (n: number) => string;
	formatLabel?: (label: string) => string;
}

const W = 640;
const H = 220;
const PAD = { top: 12, right: 16, bottom: 28, left: 40 };

const LineChart = ({
	data,
	color,
	formatValue,
	formatLabel = (l) => l,
}: LineChartProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [hovered, setHovered] = useState<number | null>(null);

	if (data.length === 0) {
		return <p className="text-sm text-gray-500 py-10 text-center">No data yet</p>;
	}

	const plotW = W - PAD.left - PAD.right;
	const plotH = H - PAD.top - PAD.bottom;
	const max = Math.max(...data.map((d) => d.value), 1);
	// round the y-max up to a clean step so gridline labels are whole numbers
	const step = Math.max(1, Math.ceil(max / 4));
	const yMax = step * 4;

	const x = (i: number) =>
		PAD.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
	const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

	const linePath = data
		.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`)
		.join(' ');
	const areaPath = `${linePath} L ${x(data.length - 1)} ${PAD.top + plotH} L ${x(0)} ${PAD.top + plotH} Z`;

	const xTickEvery = Math.max(1, Math.ceil(data.length / 6));

	const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
		const svg = svgRef.current;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const px = ((e.clientX - rect.left) / rect.width) * W;
		const frac = (px - PAD.left) / plotW;
		const i = Math.round(frac * (data.length - 1));
		setHovered(Math.min(Math.max(i, 0), data.length - 1));
	};

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${W} ${H}`}
			className="w-full"
			role="img"
			aria-label="Line chart"
			onMouseMove={handleMove}
			onMouseLeave={() => setHovered(null)}
		>
			{/* gridlines + y labels */}
			{[0, 1, 2, 3, 4].map((t) => {
				const gy = PAD.top + plotH - (t / 4) * plotH;
				return (
					<g key={t}>
						<line
							x1={PAD.left}
							y1={gy}
							x2={W - PAD.right}
							y2={gy}
							stroke={t === 0 ? INK.axis : INK.grid}
							strokeWidth={1}
						/>
						<text
							x={PAD.left - 8}
							y={gy}
							textAnchor="end"
							dominantBaseline="middle"
							fontSize={11}
							fill={INK.muted}
							className="tabular-nums"
						>
							{formatValue(t * step)}
						</text>
					</g>
				);
			})}

			{/* x labels */}
			{data.map((d, i) =>
				i % xTickEvery === 0 ? (
					<text
						key={d.label}
						x={x(i)}
						y={H - 8}
						textAnchor="middle"
						fontSize={11}
						fill={INK.muted}
					>
						{formatLabel(d.label)}
					</text>
				) : null,
			)}

			<path d={areaPath} fill={color} opacity={0.08} />
			<path d={linePath} fill="none" stroke={color} strokeWidth={2} />

			{/* crosshair + tooltip */}
			{hovered !== null && (
				<g>
					<line
						x1={x(hovered)}
						y1={PAD.top}
						x2={x(hovered)}
						y2={PAD.top + plotH}
						stroke={INK.axis}
						strokeWidth={1}
						strokeDasharray="3 3"
					/>
					<circle
						cx={x(hovered)}
						cy={y(data[hovered].value)}
						r={4}
						fill={color}
						stroke="#ffffff"
						strokeWidth={2}
					/>
					<g
						transform={`translate(${Math.min(x(hovered) + 10, W - 150)}, ${PAD.top + 4})`}
					>
						<rect
							width={140}
							height={40}
							rx={6}
							fill="#ffffff"
							stroke={INK.grid}
						/>
						<text x={10} y={17} fontSize={11} fill={INK.muted}>
							{formatLabel(data[hovered].label)}
						</text>
						<text
							x={10}
							y={32}
							fontSize={12}
							fontWeight={600}
							fill={INK.primary}
						>
							{formatValue(data[hovered].value)}
						</text>
					</g>
				</g>
			)}
		</svg>
	);
};

export default LineChart;
