import { Request, Response, NextFunction } from 'express';
import { formatQuantity, formatCurrency } from '../utils/format.js';
import * as db from '../db/queries/index.js';

export const setLocals = async (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated() && req.user) {
		res.locals.firstName = req.user.first_name;
		res.locals.user = req.user;
		res.locals.email = req.user.email;
		const company = await db.getCompanyById(req.user.company_id);
		res.locals.companyName = company ? company.name : '';
	} else {
		res.locals.firstName = '';
		res.locals.user = null;
		res.locals.companyName = '';
	}
	res.locals.formatQuantity = formatQuantity;
	res.locals.formatCurrency = formatCurrency;
	next();
};
