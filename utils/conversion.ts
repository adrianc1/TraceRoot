import type { Unit } from '../types';

const weightToGrams: Partial<Record<Unit, number>> = {
	mg: 0.001,
	g: 1,
	kg: 1000,
	oz: 28.3495,
	lb: 453.592,
};

const volumeToMl: Partial<Record<Unit, number>> = {
	ml: 1,
	l: 1000,
};

function convertQuantity(amount: number, fromUnit: Unit, toUnit: Unit) {
	const fromGrams = weightToGrams[fromUnit];
	const toGrams = weightToGrams[toUnit];
	const fromMl = volumeToMl[fromUnit];
	const toMl = volumeToMl[toUnit];

	if (fromGrams === toGrams || fromMl === toMl) return amount;

	if (fromGrams !== undefined && toGrams !== undefined) {
		const grams = amount * fromGrams;
		return grams / toGrams;
	}
	//volume conversion
	if (fromMl !== undefined && toMl !== undefined) {
		const ml = amount * fromMl;
		return ml / toMl;
	}

	throw new Error(`Cannot convert ${fromUnit} to ${toUnit}`);
}

export { convertQuantity };
