require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pool = require('./db/pool.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgSession = require('connect-pg-simple')(session);
const flash = require('connect-flash');
const path = require('node:path');
const brandsRouter = require('./routes/brandsRouter');
const categoryRouter = require('./routes/categoryRouter');
const productsRouter = require('./routes/productsRouter');
const strainsRouter = require('./routes/strainsRouter');
const signupRouter = require('./routes/auth/signupRouter');
const loginRouter = require('./routes/auth/loginRouter');
const transfersRouter = require('./routes/transfersRouter');
const locationsRouter = require('./routes/locationsRouter');
const usersRouter = require('./routes/usersRouter');
const billingRouter = require('./routes/billingRouter');
const { setLocals } = require('./middleware/appMiddleware');
const {
	ensureAuthenticated,
	redirectIfAuthenticated,
} = require('./middleware/authMiddleware.js');
const { checkTrial } = require('./middleware/trialMiddleware');

const app = express();
const PORT = 3000;

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Webhook must receive raw body — register before express.json()
app.post(
	'/billing/webhook',
	express.raw({ type: 'application/json' }),
	billingRouter,
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sessions
require('./auth/passport')(passport);

app.use(
	// session({
	// dev env
	// 	secret: process.env.COOKIE_SECRET,
	// 	resave: false,
	// 	saveUninitialized: false,
	// 	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
	// }),
	session({
		store: new pgSession({
			pool: pool,
			tableName: 'session',
		}),
		secret: process.env.COOKIE_SECRET,
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

app.use('/login', redirectIfAuthenticated, loginRouter);
app.use('/', signupRouter);
app.use('/api/users', ensureAuthenticated, usersRouter);

app.use('/api/packages', ensureAuthenticated, productsRouter);
app.use('/api/categories', ensureAuthenticated, categoryRouter);
app.use('/api/strains', ensureAuthenticated, strainsRouter);
app.use('/api/brands', ensureAuthenticated, brandsRouter);
app.use('/api/transfers', ensureAuthenticated, transfersRouter);
app.use('/api/locations', ensureAuthenticated, locationsRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/dist')));
	app.get('/{*path}', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/dist/index.html'));
	});
}

app.listen(PORT, () => {
	// console.log(`server running on PORT ${PORT}`);
});
