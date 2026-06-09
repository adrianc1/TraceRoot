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

export interface Category {
	id: number;
	name: string;
	description: string | null;
	company_id: number;
}

export interface Product {
	id: number;
	name: string;
	description: string | null;
	unit: Unit;
	category_id: number | null;
	sku: string | null;
	status: 'active' | 'inactive';
	brand_id: number | null;
	strain_id: number | null;
	company_id: number;
}

export interface ProductWithDetails extends Product {
	brand_name: string | null;
	category_name: string | null;
	strain_name: string | null;
	total_quantity: number | null;
}
