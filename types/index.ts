export type Unit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'ml' | 'l' | 'each';

export type InventoryStatus =
	| 'active'
	| 'inactive'
	| 'quarantine'
	| 'damaged'
	| 'expired'
	| 'reserved';

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

// inside json_build_object in getAuditTrail query
export interface AuditMovement {
	id: number;
	movement_type: string;
	quantity: number;
	starting_quantity: number | null;
	ending_quantity: number | null;
	cost_per_unit: number | null;
	notes: string | null;
	user_id: number | null;
	user_name: string | null;
	created_at: string;
}

// top-level row
export interface AuditPackageRow {
	package_id: number;
	package_tag: string;
	quantity: string;
	cost_price: string | null;
	status: InventoryStatus;
	location: string;
	package_unit: Unit;
	batch_id: number | null;
	lot_number: string | null;
	product_name: string;
	product_unit: Unit;
	brand_name: string | null;
	strain_name: string | null;
	category_name: string | null;
	movements: AuditMovement[];
}

export interface Package {
	id: number;
	package_tag: string;
	external_id: string | null;
	product_id: number;
	company_id: number;
	parent_package_id: number | null;
	batch_id: number | null;
	location_id: number;
	status: InventoryStatus;
	quantity: string;
	package_size: string | null;
	unit: Unit;
	cost_price: string | null;
	supplier_name: string | null;
	lot_number: string | null;
	locked: boolean;
	updated_at: Date;
	created_at: Date;
}

export interface PackageWithDetails extends Omit<
	Package,
	| 'company_id'
	| 'external_id'
	| 'supplier_name'
	| 'locked'
	| 'updated_at'
	| 'batch_id'
> {
	location: string;
	product_name: string;
	product_sku: string;
	category_name: string | null;
	category_id: number | null;
	brand_name: string | null;
	strain_name: string | null;
	batch_number: string | null;
	parent_package_tag: string | null;
}

export interface PackageFilters {
	search?: string;
	brand?: string;
	category?: string;
	sort?: string;
}

export interface Transfer {
	id: number;
	company_id: number;
	transfer_type: 'internal' | 'external';
	from_location_id: number;
	to_location_id: number | null;
	to_company_name: string | null;
	notes: string | null;
	created_by: number;
	status: 'pending' | 'confirmed' | 'cancelled';
	confirmed_at: Date | null;
	created_at: Date;
}

export interface TransferItem {
	package_id: number;
	quantity: number;
	current_quantity: number;
}

export interface TransferDetail {
	id: number;
	transfer_type: 'internal' | 'external';
	status: 'pending' | 'confirmed' | 'cancelled';
	notes: string | null;
	created_at: Date;
	confirmed_at: Date | null;
	from_location: string;
	to_location: string | null;
	to_company_name: string | null;
	created_by: string;
}

export interface TransferItemDetail {
	id: number;
	quantity: number;
	package_id: number;
	product_name: string;
	strain_name: string | null;
	category_name: string | null;
	cost_price: string | null;
	unit: Unit;
	batch_id: number | null;
	current_quantity: number;
}

export interface TransferListRow {
	id: number;
	transfer_type: 'internal' | 'external';
	status: 'pending' | 'confirmed' | 'cancelled';
	created_at: Date;
	from_location: string;
	to_location: string | null;
	to_company_name: string | null;
	package_count: string;
}

export interface TransferStatus {
	id: number;
	company_id: number;
	status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Split {
	productId: number;
	packageSize: number | null;
	quantity: number;
	totalWeight: number;
	package_tag: string;
}

export interface ApplyMovementParams {
	package_tag: string;
	product_id: number;
	packages_id: number | null;
	batch_id: number | null;
	company_id: number;
	location_id: number;
	batch: string | null; //lot_number
	targetQty: number;
	movement_type: string;
	notes: string | null;
	cost_per_unit: number | null;
	userId: number;
	status: InventoryStatus | null;
	package_size: number | null;
	unit: Unit;
}

export interface MovementResult {
	inventoryId: number | null;
	startingQty: number;
	delta: number;
	endingQty: number | undefined;
	status: InventoryStatus | string | null;
}

export interface CompanyBilling {
	stripe_customer_id?: string;
	stripe_subscription_status?: string;
	trial_ends_at?: string;
	id: number;
}

export interface UpdateBilling {
	stripe_customer_id?: string;
	stripe_subscription_status?: string;
}

export interface GetCompanyByStripeCustomer {
	id: number;
	stripe_subscription_status: string;
}

export interface Companies {
	id: number;
	name: string;
	license_number: string;
}

export interface Users {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	company_id: number;
	role: string;
}

export interface UserWithCompany extends Users {
	company_name: string;
	active: boolean;
	created_at: Date;
}

export interface CreateInviteParams {
	company_id: number;
	email: string;
	role: 'admin' | 'manager' | 'staff';
	token: string;
	expires_at: Date;
	created_by: number;
}

export interface Invites {
	id: number;
	company_id: number;
	email: string;
	role: 'admin' | 'manager' | 'staff';
	token: string;
	expires_at: Date;
	created_by: number;
	accepted_at: Date | null;
}
