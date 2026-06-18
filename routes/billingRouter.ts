import express, { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';
import { getBilling, handleWebhookEvent } from '../controllers/billingController';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router: Router = express.Router();

router.get('/', getBilling);

router.get('/checkout', ensureAuthenticated, async (req: Request, res: Response) => {
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
			customer_email: req.user!.email,
			metadata: { company_id: String(req.user!.company_id) },
			success_url: `${req.protocol}://${req.get('host')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.protocol}://${req.get('host')}/pricing`,
		});

		res.redirect(303, session.url!);
	} catch (error) {
		console.error(error);
		res.redirect('/pricing?error=true');
	}
});

router.get('/success', ensureAuthenticated, (_req: Request, res: Response) => {
	res.render('billing/success');
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
	const sig = req.headers['stripe-signature'];
	let event: ReturnType<typeof stripe.webhooks.constructEvent>;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
	} catch (err: any) {
		console.error('Webhook signature failed:', err.message);
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	try {
		await handleWebhookEvent(event, res);
	} catch (error) {
		console.error('Webhook handler error:', error);
		res.status(500).json({ error: 'Webhook handler failed' });
	}
});

export default router;
