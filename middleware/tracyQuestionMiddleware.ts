import { ValidationChain, body } from 'express-validator';
export const validateTracyQuestion: ValidationChain[] = [
	body('question')
		.isString()
		.trim()
		.withMessage(`Question must be a valid string`)
		.isLength({ min: 5, max: 300 })
		.withMessage(`Question must be between 5-300 characters`),
];
