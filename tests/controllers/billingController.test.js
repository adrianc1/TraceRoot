const { getBilling, handleWebhookEvent } = require('../../controllers/billingController');
const db = require('../../db/queries');

jest.mock('../../db/queries');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
	const res = {};
	res.json = jest.fn();
	res.status = jest.fn().mockReturnValue(res);
	return res;
};

describe('getBilling', () => {
	test('returns billing info for the company', async () => {
		const billing = { stripe_subscription_status: 'active', trial_ends_at: null };
		db.getCompanyBilling.mockResolvedValue(billing);

		const req = { user: { company_id: 13 } };
		const res = mockRes();

		await getBilling(req, res);

		expect(db.getCompanyBilling).toHaveBeenCalledWith(13);
		expect(res.json).toHaveBeenCalledWith(billing);
	});

	test('returns 500 on error', async () => {
		db.getCompanyBilling.mockRejectedValue(new Error('DB error'));

		const req = { user: { company_id: 13 } };
		const res = mockRes();

		await getBilling(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch billing info' });
	});
});

describe('handleWebhookEvent', () => {
	test('checkout.session.completed sets subscription to active', async () => {
		db.updateCompanyBilling.mockResolvedValue({});

		const event = {
			type: 'checkout.session.completed',
			data: { object: { customer: 'cus_123', metadata: { company_id: '13' } } },
		};
		const res = mockRes();

		await handleWebhookEvent(event, res);

		expect(db.updateCompanyBilling).toHaveBeenCalledWith('13', {
			stripe_customer_id: 'cus_123',
			stripe_subscription_status: 'active',
		});
		expect(res.json).toHaveBeenCalledWith({ received: true });
	});

	test('customer.subscription.updated updates status', async () => {
		db.getCompanyByStripeCustomer.mockResolvedValue({ id: 13 });
		db.updateCompanyBilling.mockResolvedValue({});

		const event = {
			type: 'customer.subscription.updated',
			data: { object: { customer: 'cus_123', status: 'past_due' } },
		};
		const res = mockRes();

		await handleWebhookEvent(event, res);

		expect(db.getCompanyByStripeCustomer).toHaveBeenCalledWith('cus_123');
		expect(db.updateCompanyBilling).toHaveBeenCalledWith(13, {
			stripe_subscription_status: 'past_due',
		});
		expect(res.json).toHaveBeenCalledWith({ received: true });
	});

	test('customer.subscription.deleted sets status to canceled', async () => {
		db.getCompanyByStripeCustomer.mockResolvedValue({ id: 13 });
		db.updateCompanyBilling.mockResolvedValue({});

		const event = {
			type: 'customer.subscription.deleted',
			data: { object: { customer: 'cus_123' } },
		};
		const res = mockRes();

		await handleWebhookEvent(event, res);

		expect(db.updateCompanyBilling).toHaveBeenCalledWith(13, {
			stripe_subscription_status: 'canceled',
		});
		expect(res.json).toHaveBeenCalledWith({ received: true });
	});

	test('checkout.session.completed without company_id does nothing', async () => {
		const event = {
			type: 'checkout.session.completed',
			data: { object: { customer: 'cus_123', metadata: {} } },
		};
		const res = mockRes();

		await handleWebhookEvent(event, res);

		expect(db.updateCompanyBilling).not.toHaveBeenCalled();
		expect(res.json).toHaveBeenCalledWith({ received: true });
	});
});
