const pool = require('../pool');

const getCompanyBilling = async (company_id) => {
	const { rows } = await pool.query(
		`SELECT id, trial_ends_at, stripe_customer_id, stripe_subscription_status
         FROM companies WHERE id = $1`,
		[company_id],
	);
	return rows[0];
};

const updateCompanyBilling = async (company_id, { stripe_customer_id, stripe_subscription_status }) => {
	const { rows } = await pool.query(
		`UPDATE companies
         SET stripe_customer_id = COALESCE($1, stripe_customer_id),
             stripe_subscription_status = COALESCE($2, stripe_subscription_status)
         WHERE id = $3
         RETURNING id`,
		[stripe_customer_id, stripe_subscription_status, company_id],
	);
	return rows[0];
};

const getCompanyByStripeCustomer = async (stripe_customer_id) => {
	const { rows } = await pool.query(
		`SELECT id, stripe_subscription_status FROM companies WHERE stripe_customer_id = $1`,
		[stripe_customer_id],
	);
	return rows[0];
};

module.exports = { getCompanyBilling, updateCompanyBilling, getCompanyByStripeCustomer };
