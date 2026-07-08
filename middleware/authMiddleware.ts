import { Request, Response, NextFunction } from 'express';

export const ensureAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (req.isAuthenticated()) {
		return next();
	}
	// API calls get a 401 (JSON) so the SPA can handle it; page
	// navigations get redirected to the login screen.
	if (req.originalUrl.startsWith('/api')) {
		res.status(401).json({ error: 'Not authenticated' });
		return;
	}
	res.redirect('/login');
};

export const redirectIfAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}
	next();
};
