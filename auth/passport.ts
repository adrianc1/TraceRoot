import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import * as db from '../db/queries/index.js';
import pool from '../db/pool.js';

export default function configurePassport(passport: PassportStatic) {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				try {
					const user = await db.getUserByEmail(email);

					if (!user) {
						return done(null, false, { message: 'Incorrect email' });
					}
					const match = await bcrypt.compare(password, user.password_hash);

					if (!match) {
						return done(null, false, { message: 'Incorrect password' });
					}

					return done(null, user);
				} catch (err) {
					return done(err);
				}
			},
		),
	);

	passport.serializeUser((user: any, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
			const user = rows[0];

			if (!user) {
				return done(null, false);
			}
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
}
