export type TransferStatus = 'pending' | 'confirmed' | 'cancelled';

export type TransferType = 'internal' | 'external' | '';

export interface TransferSummary {
	id: number;
	transfer_type: TransferType;
	status: TransferStatus;
	from_location: string;
	to_location: string | null;
	to_company_name: string | null;
	package_count: string;
	created_at: string;
}
export interface TransferItem {
	id: number;
	package_id: number;
	package_tag: string;
	quantity: number;
	current_quantity: number;
	cost_price: string;
	unit: string;
	batch_id: number | null;
	product_name: string;
	strain_name: string;
	category_name: string;
}

export interface TransferDetail {
	id: number;
	transfer_type: TransferType;
	status: TransferStatus;
	notes: string | null;
	created_at: string;
	confirmed_at: string | null;
	from_location: string;
	to_location: string | null;
	to_company_name: string | null;
	created_by: string;
	items: TransferItem[];
}
