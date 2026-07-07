// Validated categorical palette (CVD-safe ordering — do not re-sort or cycle).
// Slots below 3:1 contrast on white (aqua, yellow) always ship with direct labels.
export const SERIES_COLORS = [
	'#2a78d6', // blue
	'#1baf7a', // aqua
	'#eda100', // yellow
	'#008300', // green
	'#4a3aa7', // violet
	'#e34948', // red
];

export const OTHER_COLOR = '#898781'; // de-emphasis gray for the folded tail

export const INK = {
	primary: '#0b0b0b',
	secondary: '#52514e',
	muted: '#898781',
	grid: '#e1e0d9',
	axis: '#c3c2b7',
};

export function formatMoney(n: number): string {
	return n.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	});
}

export function formatCount(n: number): string {
	return n.toLocaleString('en-US');
}
