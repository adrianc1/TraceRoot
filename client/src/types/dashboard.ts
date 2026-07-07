export interface DashboardKpis {
	active_packages: number;
	inventory_value: number;
	active_products: number;
	active_locations: number;
	low_stock_packages: number;
	movements_30d: number;
}

export interface CategoryValueRow {
	category: string;
	value: number;
	package_count: number;
}

export interface LocationQuantityRow {
	location: string;
	package_count: number;
	value: number;
}

export interface DailyMovementRow {
	day: string;
	movements: number;
}

export interface PackageStatusRow {
	status: string;
	count: number;
}

export interface DashboardStats {
	kpis: DashboardKpis;
	byCategory: CategoryValueRow[];
	byLocation: LocationQuantityRow[];
	dailyMovements: DailyMovementRow[];
	statusBreakdown: PackageStatusRow[];
}
