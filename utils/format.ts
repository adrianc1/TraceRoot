import type { Unit } from '../types';
function formatQuantity(quantity: number, unit: Unit) {
	const num = Number(quantity || 0);

	if (unit === 'each') {
		return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
	}

	return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatCurrency(value: number) {
	return Number(value || 0).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export { formatQuantity, formatCurrency };
