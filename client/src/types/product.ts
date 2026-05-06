export interface Product {
	id: number;
	name: string;
	description: string;
	unit: string;
	category_id: number;
	sku: string;
	status: 'active' | 'archived';
	brand_name: string | null;
	category_name: string | null;
	strain_name: string | null;
	total_quantity: number | null;
	product_qty: number | null;
	average_cost: number | null;
}
