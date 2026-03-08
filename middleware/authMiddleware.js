module.exports = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	},
	setUserLocals: (req, res, next) => {
		if (req.isAuthenticated() && req.user) {
			res.locals.firstName = req.user.first_name;
			res.locals.user = req.user;
			res.locals.email = req.user.email;
		} else {
			res.locals.firstName = 'Guest';
			res.locals.user = null;
		}
		next();
	},
};
