import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { askTracy } from '../services/tracy';
import { tracyQuery } from '../db/queries/tracy';
import { isSafeSql } from '../utils/sqlValidation';

export const tracyCoordinator = async (req: Request, res: Response) => {
	const questionErrors = validationResult(req);

	if (!questionErrors.isEmpty()) {
		return res.status(400).json({ errors: questionErrors.array() });
	}
	try {
		const company_id: number = req.user!.company_id;
		const { question } = await req.body;

		const { sql, explanation, tables_used } = await askTracy(question);
		let result;

		if (!sql) {
			res.status(200).json({ explanation: explanation || 'No SQL generated' });
			return;
		}

		if (isSafeSql(sql)) {
			result = await tracyQuery(sql, company_id);
		} else {
			return res.status(500).json({ error: 'Invalid SQL generated' });
		}

		res.json({
			sql,
			explanation,
			tables_used,
			result,
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};
