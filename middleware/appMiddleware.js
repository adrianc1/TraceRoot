const { formatQuantity, formatCurrency } = require('../utils/format');

module.exports = {
	setLocals: (req, res, next) => {
		if (req.isAuthenticated() && req.user) {
			res.locals.firstName = req.user.first_name;
			res.locals.user = req.user;
			res.locals.email = req.user.email;
		} else {
			res.locals.firstName = 'Guest';
			res.locals.user = null;
		}
		res.locals.formatQuantity = formatQuantity;
		res.locals.formatCurrency = formatCurrency;
		next();
	},
};
