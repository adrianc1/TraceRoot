import { Request, Response } from 'express';
import * as db from '../db/queries';

export const getDashboardStats = async (req: Request, res: Response) => {
	try {
		const companyId = req.user!.company_id;

		const [kpis, byCategory, byLocation, dailyMovements, statusBreakdown] =
			await Promise.all([
				db.getDashboardKpis(companyId),
				db.getInventoryValueByCategory(companyId),
				db.getInventoryByLocation(companyId),
				db.getDailyMovements(companyId),
				db.getPackageStatusBreakdown(companyId),
			]);

		res.json({ kpis, byCategory, byLocation, dailyMovements, statusBreakdown });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to load dashboard stats' });
	}
};

export const dashboardController = {
	getDashboardStats,
};
