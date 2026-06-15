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

// Product interfaces

export interface Product {
	id: number;
	name: string;
	description: string | null;
	unit: Unit;
	category_id: number | null;
	sku: string | null;
	status: 'active' | 'archived';
	brand_id: number | null;
	strain_id: number | null;
	company_id: number;
}

export interface ProductWithDetails
	extends
		Pick<
			Product,
			'id' | 'name' | 'description' | 'unit' | 'category_id' | 'sku' | 'status'
		>,
		ProductJoinNames {
	total_quantity: number | null;
}

export interface ProductJoinNames {
	brand_name: string | null;
	category_name: string | null;
	strain_name: string | null;
}

export interface ProductListRow
	extends
		Pick<
			Product,
			'id' | 'name' | 'description' | 'unit' | 'status' | 'category_id'
		>,
		ProductJoinNames {
	product_qty: number;
	total_valuation: number;
	average_cost: number;
}

export interface ProductWithInventory
	extends Omit<Product, 'company_id'>, ProductJoinNames {
	total_quantity: number;
	total_valuation: number;
	average_cost: number;
}

export type ProductWithNames = Omit<Product, 'company_id'> & ProductJoinNames;

// inventory status interface
export type InventoryStatus =
	| 'active'
	| 'inactive'
	| 'quarantine'
	| 'damaged'
	| 'expired'
	| 'reserved';

// Batch interfaces
export interface Batch {
	id: number;
	product_id: number;
	company_id: number;
	batch_number: string;
	total_quantity: string;
	unit: Unit;
	cost_per_unit: string | null;
	supplier_name: string | null;
	status: InventoryStatus;
	created_at: Date;
}

// Location interfaces
export interface Location {
	id: number;
	company_id: number;
	name: string;
	description: string | null;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}
