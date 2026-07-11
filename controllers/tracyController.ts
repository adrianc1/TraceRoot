import type { Request, Response } from 'express';
import { askTracy } from '../services/tracy';
import { tracyQuery } from '../db/queries/tracy';

export const tracyCoordinator = async (req: Request, res: Response) => {
	try {
		const company_id: number = req.user!.company_id;
		const { question } = await req.body;
		const { sql, explanation, tables_used } = await askTracy(question);

		if (!sql) {
			res.status(404).json({ error: 'No SQL returned from Tracy' });
			return;
		}

		const result = await tracyQuery(sql, company_id);

		res.json({
			sql,
			explanation,
			tables_used,
			result,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};
