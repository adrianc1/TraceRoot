export type Role = 'admin' | 'manager' | 'staff';

export interface CurrentUser {
	id: number;
	first_name: string;
	last_name: string;
	role: Role;
	email: string;
	company_name: string;
}

export interface User {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	role: Role;
	created_at: string;
}
