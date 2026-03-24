const { formatQuantity, formatCurrency } = require('../utils/format');
const db = require('../db/queries');

module.exports = {
	setLocals: async (req, res, next) => {
		if (req.isAuthenticated() && req.user) {
			res.locals.firstName = req.user.first_name;
			res.locals.user = req.user;
			res.locals.email = req.user.email;
			const company = await db.getCompanyById(req.user.company_id);
			res.locals.companyName = company ? company.name : '';
		} else {
			res.locals.firstName = 'Guest';
			res.locals.user = null;
			res.locals.companyName = '';
		}
		res.locals.formatQuantity = formatQuantity;
		res.locals.formatCurrency = formatCurrency;
		next();
	},
};
