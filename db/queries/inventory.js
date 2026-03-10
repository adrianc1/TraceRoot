const pool = require('../pool');

const getAuditTrail = async (productId) => {
	try {
		const { rows } = await pool.query(
			`SELECT 
    pk.id AS package_id,
    pk.package_tag,
    pk.quantity,
    pk.cost_price,
    pk.status,
    l.name AS location,
    pk.unit AS package_unit,
    pk.batch_id,
    pk.lot_number,
    pr.name AS product_name,
    pr.unit AS product_unit,
    b.name AS brand_name,
    s.name AS strain_name,
    c.name AS category_name,
    COALESCE(
      json_agg(
        json_build_object(
          'id', im.id,
          'movement_type', im.movement_type,
          'quantity', im.quantity,
          'starting_quantity', im.starting_quantity,
          'ending_quantity', im.ending_quantity,
          'cost_per_unit', im.cost_per_unit,
          'notes', im.notes,
          'user_id', im.user_id,
          'user_name', u.first_name || ' ' || u.last_name,
          'created_at', im.created_at
        ) ORDER BY im.created_at DESC
      ) FILTER (WHERE im.id IS NOT NULL), '[]'
    ) AS movements
    FROM packages pk
    JOIN products pr ON pr.id = pk.product_id
    JOIN locations l ON l.id = pk.location_id
    LEFT JOIN brands b ON b.id = pr.brand_id
    LEFT JOIN strains s ON s.id = pr.strain_id
    LEFT JOIN categories c ON c.id = pr.category_id
    LEFT JOIN inventory_movements im ON im.packages_id = pk.id
    LEFT JOIN users u ON u.id = im.user_id
    WHERE pk.product_id = $1
    GROUP BY pk.id, pr.name, pr.unit, b.name, s.name, c.name, l.name
    ORDER BY pk.id;
`,
			[productId],
		);

		return rows;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getProductInventory = async (productId) => {
	const { rows } = await pool.query(
		`
        SELECT pk.*, 
        COALESCE(cost_price, 0) AS cost_price,
        l.name AS location
        FROM packages pk
        JOIN locations l on l.id = pk.location_id
        WHERE product_id=$1
        ORDER BY created_at, location
        `,
		[productId],
	);

	const batchesMap = {};
	rows.forEach((pkg) => {
		if (!pkg.source_lot_id) {
			batchesMap[pkg.id] = { ...pkg, packages: [] };
		}
	});

	rows.forEach((pkg) => {
		if (pkg.source_lot_id) {
			const source = batchesMap[pkg.source_lot_id];
			if (source) {
				source.packages.push(pkg);
			} else {
				batchesMap[pkg.id] = { ...pkg, packages: [] };
			}
		}
	});

	return Object.values(batchesMap);
};

module.exports = { getAuditTrail, getProductInventory };
