import type { Request, Response } from 'express';
import * as db from '../db/queries';
export const getAllStrains = async (req: Request, res: Response) => {
	try {
		const strains = await db.getAllStrains(req.user!.company_id);
		res.json(strains);
	} catch (error) {
		res.status(500).json({ error: 'Database error' });
	}
};

export const getStrain = async (req: Request, res: Response) => {
	try {
		const strain = await db.getStrain(
			Number(req.params.id),
			req.user!.company_id,
		);
		if (!strain) {
			res.status(404).json({ error: 'Strain not found' });
			return;
		}
		res.json(strain);
	} catch (error) {
		res.status(500).json({ error: 'Database error retreiving single product' });
	}
};

export const insertStrain = async (req: Request, res: Response) => {
	try {
		const { name, description, type } = req.body;
		await db.insertStrain(name, req.user!.company_id, description, type);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error inserting strain' });
	}
};

export const updateStrain = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const { name, description } = req.body;
	await db.updateStrain(name, description, id);
	res.status(200).json({ success: true });
};

export const deleteStrain = async (req: Request, res: Response) => {
	try {
		await db.deleteStrain(Number(req.params.id));
		res.status(200).json({ success: true });
	} catch (error) {
		res.json({ error: 'there is an error.' });
	}
};
