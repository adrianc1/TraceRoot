export type Unit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'ml' | 'l' | 'each';

export interface Brand {
	id: number;
	name: string;
	description: string | null;
	company_id: number;
}

export interface Strain {
	id: number;
	name: string;
	company_id: number;
	type: string | null;
	description: string | null;
}
