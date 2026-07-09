import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pool from './db/pool.js';
import passport from 'passport';
import connectPgSimple from 'connect-pg-simple';
import flash from 'connect-flash';
import path from 'node:path';
import brandsRouter from './routes/brandsRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import productsRouter from './routes/productsRouter.js';
import strainsRouter from './routes/strainsRouter.js';
import signupRouter from './routes/auth/signupRouter.js';
import loginRouter from './routes/auth/loginRouter.js';
import transfersRouter from './routes/transfersRouter.js';
import locationsRouter from './routes/locationsRouter.js';
import usersRouter from './routes/usersRouter.js';
import usersEjsRouter from './routes/usersEjsRouter.js';
import billingRouter from './routes/billingRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import { setLocals } from './middleware/appMiddleware.js';
import {
	ensureAuthenticated,
	redirectIfAuthenticated,
} from './middleware/authMiddleware.js';
import { checkTrial } from './middleware/trialMiddleware.js';
import configurePassport from './auth/passport.js';

const pgSession = connectPgSimple(session);

const app = express();
const PORT: number = 3000;

app.use(cors());

app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// bill webhoopk
app.post(
	'/billing/webhook',
	express.raw({ type: 'application/json' }),
	billingRouter,
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sessions
configurePassport(passport);

app.use(
	session({
		store: new pgSession({
			pool: pool,
			tableName: 'session',
		}),
		secret: process.env.COOKIE_SECRET as string,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(setLocals);
app.use(checkTrial);

// marketing pages - static
app.get('/privacy', (_req, res) => res.render('privacy'));
app.get('/terms', (_req, res) => res.render('terms'));
app.get('/features', (_req, res) => res.render('features'));
app.get('/pricing', (req, res) => res.render('pricing', { query: req.query }));
app.get('/contact', (_req, res) => res.render('contact'));
app.use('/api/billing', ensureAuthenticated, billingRouter);
app.use('/billing', ensureAuthenticated, billingRouter);

app.use('/login', redirectIfAuthenticated, loginRouter);
app.use('/', signupRouter);
app.use('/api/users', ensureAuthenticated, usersRouter);
app.use('/users', ensureAuthenticated, usersEjsRouter);

app.use('/api/packages', ensureAuthenticated, productsRouter);
app.use('/api/categories', ensureAuthenticated, categoryRouter);
app.use('/api/strains', ensureAuthenticated, strainsRouter);
app.use('/api/brands', ensureAuthenticated, brandsRouter);
app.use('/api/transfers', ensureAuthenticated, transfersRouter);
app.use('/api/locations', ensureAuthenticated, locationsRouter);
app.use('/api/dashboard', ensureAuthenticated, dashboardRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('client/dist')));
	app.get('/{*path}', (req, res) => {
		if (!req.isAuthenticated()) {
			return res.redirect('/login');
		}
		res.sendFile(path.resolve('client/dist/index.html'));
	});
}

app.listen(PORT, () => {
	// console.log(`server running on PORT ${PORT}`);
});
