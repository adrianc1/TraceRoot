import { Request, Response } from 'express';
import db from '../db/queries';

export const getBilling = async (req: Request, res: Response) => {
	try {
		const billing = await db.getCompanyBilling(req.user!.company_id);
		res.json(billing);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch billing info' });
	}
};

export const handleWebhookEvent = async (event: any, res: Response) => {
	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object;
			const company_id = session.metadata?.company_id;
			if (company_id) {
				await db.updateCompanyBilling(company_id, {
					stripe_customer_id: session.customer,
					stripe_subscription_status: 'active',
				});
			}
			break;
		}
		case 'customer.subscription.updated': {
			const sub = event.data.object;
			const company = await db.getCompanyByStripeCustomer(sub.customer);
			if (company) {
				await db.updateCompanyBilling(company.id, {
					stripe_subscription_status: sub.status,
				});
			}
			break;
		}
		case 'customer.subscription.deleted': {
			const sub = event.data.object;
			const company = await db.getCompanyByStripeCustomer(sub.customer);
			if (company) {
				await db.updateCompanyBilling(company.id, {
					stripe_subscription_status: 'canceled',
				});
			}
			break;
		}
	}

	res.json({ received: true });
};
