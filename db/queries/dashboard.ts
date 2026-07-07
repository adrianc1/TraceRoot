import pool from '../pool';

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

export const getDashboardKpis = async (
	companyId: number,
): Promise<DashboardKpis> => {
	const { rows } = await pool.query(
		`SELECT
        (SELECT COUNT(*)::int FROM packages
            WHERE company_id = $1 AND status = 'active') AS active_packages,
        (SELECT COALESCE(SUM(quantity * cost_price), 0)::float FROM packages
            WHERE company_id = $1 AND status = 'active') AS inventory_value,
        (SELECT COUNT(*)::int FROM products
            WHERE company_id = $1 AND status = 'active') AS active_products,
        (SELECT COUNT(*)::int FROM locations
            WHERE company_id = $1 AND is_active = true) AS active_locations,
        (SELECT COUNT(*)::int FROM packages
            WHERE company_id = $1 AND status = 'active' AND quantity <= 0) AS low_stock_packages,
        (SELECT COUNT(*)::int FROM inventory_movements
            WHERE company_id = $1
            AND created_at >= NOW() - INTERVAL '30 days') AS movements_30d`,
		[companyId],
	);
	return rows[0];
};

export const getInventoryValueByCategory = async (
	companyId: number,
): Promise<CategoryValueRow[]> => {
	const { rows } = await pool.query(
		`SELECT
        COALESCE(c.name, 'Uncategorized') AS category,
        COALESCE(SUM(pk.quantity * pk.cost_price), 0)::float AS value,
        COUNT(pk.id)::int AS package_count
     FROM packages pk
     JOIN products p ON p.id = pk.product_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE pk.company_id = $1 AND pk.status = 'active'
     GROUP BY c.name
     ORDER BY value DESC`,
		[companyId],
	);
	return rows;
};

export const getInventoryByLocation = async (
	companyId: number,
): Promise<LocationQuantityRow[]> => {
	const { rows } = await pool.query(
		`SELECT
        l.name AS location,
        COUNT(pk.id)::int AS package_count,
        COALESCE(SUM(pk.quantity * pk.cost_price), 0)::float AS value
     FROM locations l
     LEFT JOIN packages pk
        ON pk.location_id = l.id AND pk.status = 'active'
     WHERE l.company_id = $1 AND l.is_active = true
     GROUP BY l.name
     ORDER BY value DESC`,
		[companyId],
	);
	return rows;
};

export const getDailyMovements = async (
	companyId: number,
): Promise<DailyMovementRow[]> => {
	const { rows } = await pool.query(
		`SELECT
        to_char(d.day, 'YYYY-MM-DD') AS day,
        COUNT(im.id)::int AS movements
     FROM generate_series(
        (NOW() - INTERVAL '29 days')::date, NOW()::date, '1 day'
     ) AS d(day)
     LEFT JOIN inventory_movements im
        ON im.company_id = $1 AND im.created_at::date = d.day
     GROUP BY d.day
     ORDER BY d.day`,
		[companyId],
	);
	return rows;
};

export const getPackageStatusBreakdown = async (
	companyId: number,
): Promise<PackageStatusRow[]> => {
	const { rows } = await pool.query(
		`SELECT status, COUNT(*)::int AS count
     FROM packages
     WHERE company_id = $1
     GROUP BY status
     ORDER BY count DESC`,
		[companyId],
	);
	return rows;
};
