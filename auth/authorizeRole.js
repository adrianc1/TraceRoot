const authorizeRole =
	(...roles) =>
	(req, res, next) => {
		if (roles.includes(req.user.role)) return next();
		res
			.status(403)
			.render('partials/errors', { errors: [{ msg: 'Forbidden' }] });
	};

module.exports = authorizeRole;
