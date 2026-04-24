const db = require('../db/queries');

const BYPASS_PATHS = ['/billing', '/pricing', '/login', '/logout', '/signup', '/', '/features', '/contact', '/privacy', '/terms'];

const checkTrial = async (req, res, next) => {
	if (!req.isAuthenticated() || !req.user) return next();

	const path = req.path;
	if (BYPASS_PATHS.some((p) => path === p || path.startsWith(p + '/'))) return next();

	try {
		const company = await db.getCompanyBilling(req.user.company_id);
		if (!company) return next();

		const trialActive = company.trial_ends_at && new Date() < new Date(company.trial_ends_at);
		const subscriptionActive = company.stripe_subscription_status === 'active';

		if (!trialActive && !subscriptionActive) {
			return res.redirect('/pricing?expired=true');
		}

		next();
	} catch (error) {
		console.error(error);
		next();
	}
};

module.exports = { checkTrial };
