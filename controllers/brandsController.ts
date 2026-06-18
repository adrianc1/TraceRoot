import type { Request, Response } from 'express';
import * as db from '../db/queries';

const isUniqueViolation = (error: unknown): boolean =>
	typeof error === 'object' &&
	error !== null &&
	'code' in error &&
	(error as { code?: unknown }).code === '23505';

const getAllBrands = async (req: Request, res: Response) => {
	const brands = await db.getAllBrands(req.user!.company_id);
	res.json(brands);
};

const createBrand = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;
		await db.insertBrand(name, description, req.user!.company_id);
		res.status(201).json({ success: true });
	} catch (error) {
		if (isUniqueViolation(error)) {
			return res
				.status(400)
				.json({ error: 'A brand with that name already exists.' });
		}
		res.status(500).json({ error: 'Server Error' });
	}
};

const getBrandById = async (req: Request, res: Response) => {
	const brand = await db.getBrandById(
		Number(req.params.id),
		req.user!.company_id,
	);
	res.json(brand);
};

const updateBrand = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;
		await db.updateBrand(
			name,
			description,
			Number(req.params.id),
			req.user!.company_id,
		);
		res.status(200).json({ success: true });
	} catch (err) {
		if (isUniqueViolation(err)) {
			return res
				.status(400)
				.json({ error: 'A brand with that name already exists' });
		}
		res.status(500).json({ error: 'Server error' });
	}
};

const deleteBrand = async (req: Request, res: Response) => {
	await db.deleteBrand(Number(req.params.id));
	res.status(200).json({ success: true });
};

export const brandsController = {
	getAllBrands,
	createBrand,
	getBrandById,
	updateBrand,
	deleteBrand,
};
