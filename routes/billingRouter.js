const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db/queries');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Stripe checkout session
router.get('/checkout', ensureAuthenticated, async (req, res) => {
	try {
		const { plan } = req.query;
		const priceId = plan === 'annual'
			? process.env.STRIPE_PRICE_ANNUAL
			: process.env.STRIPE_PRICE_MONTHLY;

		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [{ price: priceId, quantity: 1 }],
			automatic_tax: { enabled: true },
			customer_email: req.user.email,
			metadata: { company_id: req.user.company_id },
			success_url: `${req.protocol}://${req.get('host')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.protocol}://${req.get('host')}/pricing`,
		});

		res.redirect(303, session.url);
	} catch (error) {
		console.error(error);
		res.redirect('/pricing?error=true');
	}
});

// Success page after payment
router.get('/success', ensureAuthenticated, (req, res) => {
	res.render('billing/success');
});

// Stripe webhook — must use raw body
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
	const sig = req.headers['stripe-signature'];
	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature failed:', err.message);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	try {
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
	} catch (error) {
		console.error('Webhook handler error:', error);
		res.status(500).json({ error: 'Webhook handler failed' });
	}
});

module.exports = router;
