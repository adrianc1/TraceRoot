import { Request, Response } from 'express';
import db from '../db/queries';

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const categories = await db.getAllCategories(req.user!.company_id);
		res.json(categories);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

export const getCategory = async (req: Request, res: Response) => {
	try {
		const categoryId = req.params.id;
		const category = await db.getCategoryById(
			Number(categoryId),
			req.user!.company_id,
		);
		const products = await db.getCategory(
			Number(req.params.id),
			req.user!.company_id,
		);
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

export const insertCategory = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;

		const result = await db.insertCategory(
			name,
			req.user!.company_id,
			description,
		);
		res.status(201).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

export const updateCategory = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const { name, description } = req.body;
	await db.updateCategory(name, description, id);
	res.status(200).json({ success: true });
};

export const getProductsByCategory = async (req: Request, res: Response) => {
	try {
		const products = await db.getCategory(
			Number(req.params.id),
			req.user!.company_id,
		);
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		await db.deleteCategory(Number(req.params.id));
		res.status(201).json({ success: true });
	} catch (error) {
		res.json({ error: 'there is an error.' });
	}
};
