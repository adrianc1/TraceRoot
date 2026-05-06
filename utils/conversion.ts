import type { Unit } from '../types';
type Weight = {
	mg: number;
	g: number;
	kg: number;
	oz: number;
	lb: number;
};

type Volume = {
	ml: number;
	l: number;
};

const weightToGrams: Weight = {
	mg: 0.001,
	g: 1,
	kg: 1000,
	oz: 28.3495,
	lb: 453.592,
};

const volumeToMl: Volume = {
	ml: 1,
	l: 1000,
};

function convertQuantity(amount: number, fromUnit: Unit, toUnit: Unit) {
	if (fromUnit === toUnit) return amount;

	if (weightToGrams[fromUnit] && weightToGrams[toUnit]) {
		const grams = amount * weightToGrams[fromUnit];
		return grams / weightToGrams[toUnit];
	}
	//volume conversion
	if (volumeToMl[fromUnit] && volumeToMl[toUnit]) {
		const ml = amount * volumeToMl[fromUnit];
		return ml / volumeToMl[toUnit];
	}

	throw new Error(`Cannot convert ${fromUnit} to ${toUnit}`);
}

export { convertQuantity };
