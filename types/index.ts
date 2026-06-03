export type Unit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'ml' | 'l' | 'each';

export interface Brand {
	id: number;
	name: string;
	description: string | null;
	company_id: number;
}
