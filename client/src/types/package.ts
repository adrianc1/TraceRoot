export type PackageStatus = 'active' | 'inactive' | 'quarantine' | 'damaged' | 'expired' | 'reserved';

export interface Package {
	id: number;
	package_tag: string;
	product_id: number;
	quantity: number;
	unit: string;
	location_id: number;
	location: string;
	status: PackageStatus;
	cost_price: number;
	lot_number: string | null;
	created_at: string;
	product_name: string;
	product_sku: string;
	category_name: string | null;
	category_id: number | null;
	brand_name: string | null;
	strain_name: string | null;
	batch_number: string | null;
	parent_package_id: number | null;
	parent_package_tag: string | null;
}

export interface ProductDetail {
	id: number;
	name: string;
	description: string | null;
	sku: string;
	unit: string;
	brand_id: number | null;
	category_id: number | null;
	strain_id: number | null;
	status: 'active' | 'archived';
	brand_name: string | null;
	category_name: string | null;
	strain_name: string | null;
	total_quantity: number;
	total_valuation: number;
	average_cost: number;
}

export interface InventoryMovement {
	id: number;
	movement_type: string;
	quantity: number;
	starting_quantity: number;
	ending_quantity: number;
	cost_per_unit: number | null;
	notes: string | null;
	user_name: string;
	created_at: string;
}

export interface AuditPackage {
	id: number;
	package_tag: string;
	location: string;
	status: PackageStatus;
	movements: InventoryMovement[];
}
