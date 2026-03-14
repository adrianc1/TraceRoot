module.exports = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	},
	redirectIfAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return res.redirect('/packages');
		}
		next();
	},
};
