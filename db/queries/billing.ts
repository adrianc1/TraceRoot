import { CompanyBilling, GetCompanyByStripeCustomer } from '../../types';
import pool from '../pool';

type UpdateCompanyBilling = Pick<
	CompanyBilling,
	'stripe_customer_id' | 'stripe_subscription_status'
>;

export const getCompanyBilling = async (
	company_id: number,
): Promise<CompanyBilling> => {
	const { rows } = await pool.query<CompanyBilling>(
		`SELECT id, trial_ends_at, stripe_customer_id, stripe_subscription_status
         FROM companies WHERE id = $1`,
		[company_id],
	);
	return rows[0];
};

export const updateCompanyBilling = async (
	company_id: number,
	{ stripe_customer_id, stripe_subscription_status }: UpdateCompanyBilling,
): Promise<void> => {
	await pool.query<UpdateCompanyBilling>(
		`UPDATE companies
         SET stripe_customer_id = COALESCE($1, stripe_customer_id),
             stripe_subscription_status = COALESCE($2, stripe_subscription_status)
         WHERE id = $3
         RETURNING id`,
		[stripe_customer_id, stripe_subscription_status, company_id],
	);
};

export const getCompanyByStripeCustomer = async (
	stripe_customer_id: string,
): Promise<GetCompanyByStripeCustomer> => {
	const { rows } = await pool.query<GetCompanyByStripeCustomer>(
		`SELECT id, stripe_subscription_status FROM companies WHERE stripe_customer_id = $1`,
		[stripe_customer_id],
	);
	return rows[0];
};
