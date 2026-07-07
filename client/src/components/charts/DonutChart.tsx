import { useState } from 'react';
import { SERIES_COLORS, OTHER_COLOR, INK } from './chartTheme';

export interface DonutSlice {
	label: string;
	value: number;
}

interface DonutChartProps {
	data: DonutSlice[]; // pre-sorted descending; slices past the palette fold into "Other"
	formatValue: (n: number) => string;
}

interface ArcDatum extends DonutSlice {
	color: string;
	start: number; // fraction 0..1
	end: number;
}

function arcPath(
	cx: number,
	cy: number,
	rOuter: number,
	rInner: number,
	startFrac: number,
	endFrac: number,
): string {
	const a0 = 2 * Math.PI * startFrac - Math.PI / 2;
	const a1 = 2 * Math.PI * endFrac - Math.PI / 2;
	const large = endFrac - startFrac > 0.5 ? 1 : 0;
	const x0 = cx + rOuter * Math.cos(a0);
	const y0 = cy + rOuter * Math.sin(a0);
	const x1 = cx + rOuter * Math.cos(a1);
	const y1 = cy + rOuter * Math.sin(a1);
	const x2 = cx + rInner * Math.cos(a1);
	const y2 = cy + rInner * Math.sin(a1);
	const x3 = cx + rInner * Math.cos(a0);
	const y3 = cy + rInner * Math.sin(a0);
	return [
		`M ${x0} ${y0}`,
		`A ${rOuter} ${rOuter} 0 ${large} 1 ${x1} ${y1}`,
		`L ${x2} ${y2}`,
		`A ${rInner} ${rInner} 0 ${large} 0 ${x3} ${y3}`,
		'Z',
	].join(' ');
}

const DonutChart = ({ data, formatValue }: DonutChartProps) => {
	const [hovered, setHovered] = useState<number | null>(null);

	const maxSlices = SERIES_COLORS.length;
	const head = data.slice(0, maxSlices - 1);
	const tail = data.slice(maxSlices - 1);
	const slices: DonutSlice[] =
		tail.length > 1
			? [
					...head,
					{
						label: 'Other',
						value: tail.reduce((sum, s) => sum + s.value, 0),
					},
				]
			: data;

	const total = slices.reduce((sum, s) => sum + s.value, 0);
	if (total <= 0) {
		return <p className="text-sm text-gray-500 py-10 text-center">No data yet</p>;
	}

	let cursor = 0;
	const arcs: ArcDatum[] = slices.map((s, i) => {
		const start = cursor;
		cursor += s.value / total;
		return {
			...s,
			start,
			end: cursor,
			color: s.label === 'Other' ? OTHER_COLOR : SERIES_COLORS[i],
		};
	});

	const size = 220;
	const cx = size / 2;
	const cy = size / 2;

	return (
		<div className="flex flex-wrap items-center gap-6">
			<svg
				viewBox={`0 0 ${size} ${size}`}
				className="w-[220px] max-w-full shrink-0"
				role="img"
				aria-label="Donut chart"
			>
				{arcs.map((a, i) => (
					<path
						key={a.label}
						d={arcPath(cx, cy, 92, 58, a.start, a.end)}
						fill={a.color}
						stroke="#ffffff"
						strokeWidth={2}
						opacity={hovered === null || hovered === i ? 1 : 0.35}
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
					>
						<title>{`${a.label}: ${formatValue(a.value)} (${Math.round(((a.end - a.start) * 1000)) / 10}%)`}</title>
					</path>
				))}
				<text
					x={cx}
					y={cy - 6}
					textAnchor="middle"
					fontSize={11}
					fill={INK.muted}
				>
					{hovered !== null ? arcs[hovered].label : 'Total'}
				</text>
				<text
					x={cx}
					y={cy + 14}
					textAnchor="middle"
					fontSize={16}
					fontWeight={600}
					fill={INK.primary}
				>
					{formatValue(hovered !== null ? arcs[hovered].value : total)}
				</text>
			</svg>

			{/* legend carries the visible value labels */}
			<ul className="flex-1 min-w-[180px] space-y-2 m-0 p-0 list-none">
				{arcs.map((a, i) => (
					<li
						key={a.label}
						className="flex items-center gap-2 text-sm"
						onMouseEnter={() => setHovered(i)}
						onMouseLeave={() => setHovered(null)}
					>
						<span
							className="inline-block w-3 h-3 rounded-sm shrink-0"
							style={{ backgroundColor: a.color }}
						/>
						<span className="text-gray-700 truncate">{a.label}</span>
						<span className="ml-auto text-gray-900 tabular-nums">
							{formatValue(a.value)}
						</span>
						<span className="text-gray-500 tabular-nums w-11 text-right">
							{((a.end - a.start) * 100).toFixed(1)}%
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default DonutChart;
