import type { Request, Response } from 'express';
import * as db from '../db/queries';
const isUniqueViolation = (error: unknown): boolean =>
	typeof error === 'object' &&
	error !== null &&
	'code' in error &&
	(error as { code?: unknown }).code === '23505';

export const getAllLocations = async (req: Request, res: Response) => {
	const locations = await db.getAllLocations(req.user!.company_id);
	res.json(locations);
};

export const createLocation = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;
		await db.insertLocation(name, description, req.user!.company_id);
		res.status(201).json({ success: true });
	} catch (error) {
		if (isUniqueViolation(error)) {
			return res
				.status(400)
				.json({ error: 'A location with that name already exists.' });
		}
		res.status(500).json({ error: 'Server error' });
	}
};

export const updateLocation = async (req: Request, res: Response) => {
	try {
		const { name, description, is_active } = req.body;
		await db.updateLocation(
			name,
			description,
			is_active === true,
			Number(req.params.id),
			req.user!.company_id,
		);
		res.status(200).json({ success: true });
	} catch (error) {
		if (isUniqueViolation(error)) {
			return res
				.status(400)
				.json({ error: 'A location with that name already exists.' });
		}
		res.status(500).json({ error: 'Server error' });
	}
};

export const getLocationById = async (req: Request, res: Response) => {
	try {
		const location = await db.getLocationById(
			Number(req.params.id),
			req.user!.company_id,
		);
		if (!location) {
			return res.status(404).json({ error: 'Location not found' });
		}
		res.json(location);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};
