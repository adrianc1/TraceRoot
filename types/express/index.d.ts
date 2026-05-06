import 'express';

export interface AuthUser {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role: 'admin' | 'manager' | 'staff';
	company_id: number;
	active: boolean;
	created_at: Date;
	password_hash: string;
}

declare global {
	namespace Express {
		interface User extends AuthUser {}
	}
}
