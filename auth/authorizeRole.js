const authorizeRole =
	(...roles) =>
	(req, res, next) => {
		if (roles.includes(req.user.role)) return next();
		if (req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json')) {
			return res.status(403).json({ success: false, error: 'You do not have permission to perform this action' });
		}
		req.flash('error', 'You do not have permission to access that page');
		return res.redirect(req.headers.referer || '/packages');
	};

module.exports = authorizeRole;
