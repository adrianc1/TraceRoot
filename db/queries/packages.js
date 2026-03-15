const pool = require('../pool');

const getAllPackages = async (company_id, limit = 25, offset = 0) => {
	try {
		const { rows } = await pool.query(
			`
            SELECT
                pk.id,
                pk.package_tag,
				pk.product_id,
                pk.quantity,
                pk.unit,
                l.name AS location,
                pk.status,
                pk.cost_price,
                pk.lot_number,
                pk.created_at,
                -- Product Details
                p.name AS product_name,
                p.sku AS product_sku,
                c.name AS category_name,
				c.id AS category_id,
                b.name AS brand_name,
                s.name AS strain_name,
                -- Batch Details
                bt.batch_number,
                -- source Info
                pk.parent_package_id,
                parent_pk.package_tag AS parent_package_tag
            FROM packages AS pk
            INNER JOIN products AS p ON pk.product_id = p.id
			JOIN locations l ON l.id = pk.location_id
            LEFT JOIN categories AS c ON p.category_id = c.id
            LEFT JOIN brands AS b ON p.brand_id = b.id
            LEFT JOIN strains AS s ON p.strain_id = s.id
            LEFT JOIN batches AS bt ON pk.batch_id = bt.id
            LEFT JOIN packages AS parent_pk ON pk.parent_package_id = parent_pk.id
            WHERE pk.company_id = $1
			AND pk.locked = false
            ORDER BY pk.created_at DESC
			LIMIT $2 OFFSET $3;
            `,
			[company_id, limit, offset],
		);
		return rows;
	} catch (error) {
		console.error('Database error fetching packages:', error);
		throw error;
	}
};

const getPackagesCountByStatus = async (company_id, status, filters = {}) => {
	const { search = '', brand = '', category = '' } = filters;
	const params = status === 'all' ? [company_id] : [company_id, status];
	const conditions =
		status === 'all'
			? ['pk.company_id = $1', 'pk.locked = false']
			: ['pk.company_id = $1', 'pk.status = $2', 'pk.locked = false'];

	if (search) {
		params.push(`%${search}%`);
		const idx = params.length;
		conditions.push(
			`(pk.package_tag ILIKE $${idx} OR p.name ILIKE $${idx} OR c.name ILIKE $${idx})`,
		);
	}
	if (brand) {
		params.push(brand);
		conditions.push(`b.name = $${params.length}`);
	}
	if (category) {
		params.push(category);
		conditions.push(`c.name = $${params.length}`);
	}

	const { rows } = await pool.query(
		`SELECT COUNT(*) FROM packages AS pk
		 INNER JOIN products AS p ON pk.product_id = p.id
		 LEFT JOIN categories AS c ON p.category_id = c.id
		 LEFT JOIN brands AS b ON p.brand_id = b.id
		 WHERE ${conditions.join(' AND ')}`,
		params,
	);
	return parseInt(rows[0].count);
};

const sortMap = {
	newest: 'pk.created_at DESC',
	oldest: 'pk.created_at ASC',
	qty_asc: 'pk.quantity ASC',
	qty_desc: 'pk.quantity DESC',
	az: 'p.name ASC',
	za: 'p.name DESC',
};

const getPackagesByStatus = async (
	company_id,
	status,
	limit = 25,
	offset = 0,
	filters = {},
) => {
	const { search = '', brand = '', category = '', sort = 'newest' } = filters;
	const params = status === 'all' ? [company_id] : [company_id, status];
	const conditions =
		status === 'all'
			? ['pk.company_id = $1', 'pk.locked = false']
			: ['pk.company_id = $1', 'pk.status = $2', 'pk.locked = false'];

	if (search) {
		params.push(`%${search}%`);
		const idx = params.length;
		conditions.push(
			`(pk.package_tag ILIKE $${idx} OR p.name ILIKE $${idx} OR c.name ILIKE $${idx})`,
		);
	}
	if (brand) {
		params.push(brand);
		conditions.push(`b.name = $${params.length}`);
	}
	if (category) {
		params.push(category);
		conditions.push(`c.name = $${params.length}`);
	}

	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;

	const orderBy = sortMap[sort] || 'pk.created_at DESC';

	try {
		const { rows } = await pool.query(
			`
            SELECT
                pk.id,
                pk.package_tag,
				pk.product_id,
                pk.quantity,
                pk.unit,
				pk.location_id,
                l.name AS location,
                pk.status,
                pk.cost_price,
                pk.lot_number,
                pk.created_at,
                p.name AS product_name,
                p.sku AS product_sku,
                c.name AS category_name,
				c.id AS category_id,
                b.name AS brand_name,
                s.name AS strain_name,
                bt.batch_number,
                pk.parent_package_id,
                parent_pk.package_tag AS parent_package_tag
            FROM packages AS pk
            INNER JOIN products AS p ON pk.product_id = p.id
			JOIN locations l ON l.id = pk.location_id
            LEFT JOIN categories AS c ON p.category_id = c.id
            LEFT JOIN brands AS b ON p.brand_id = b.id
            LEFT JOIN strains AS s ON p.strain_id = s.id
            LEFT JOIN batches AS bt ON pk.batch_id = bt.id
            LEFT JOIN packages AS parent_pk ON pk.parent_package_id = parent_pk.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY ${orderBy}
			LIMIT $${limitIdx} OFFSET $${offsetIdx}
            `,
			params,
		);
		return rows;
	} catch (error) {
		console.error('Database error fetching packages:', error);
		throw error;
	}
};

const getPackagesByProductId = async (productId, companyId) => {
	const { rows } = await pool.query(
		`
        SELECT
            pk.id,
            pk.package_tag,
            pk.product_id,
            pk.quantity,
            pk.unit,
            pk.status,
            pk.cost_price,
            pk.lot_number,
            pk.created_at,
            pk.parent_package_id,
            l.name AS location,
            p.name AS product_name,
            p.sku AS product_sku,
            c.name AS category_name,
            b.name AS brand_name,
            s.name AS strain_name,
            bt.batch_number,
            parent_pk.package_tag AS parent_package_tag
        FROM packages AS pk
        INNER JOIN products AS p ON pk.product_id = p.id
        JOIN locations l ON l.id = pk.location_id
        LEFT JOIN categories AS c ON p.category_id = c.id
        LEFT JOIN brands AS b ON p.brand_id = b.id
        LEFT JOIN strains AS s ON p.strain_id = s.id
        LEFT JOIN batches AS bt ON pk.batch_id = bt.id
        LEFT JOIN packages AS parent_pk ON pk.parent_package_id = parent_pk.id
        WHERE pk.product_id = $1
        AND pk.company_id = $2
		AND pk.status = 'active'
		AND pk.locked = false
        ORDER BY pk.created_at DESC
        `,
		[productId, companyId],
	);
	return rows;
};

// NEED TO CREATED AND FINISH THE SPLIT TRANSACTION

const splitPackageTransaction = async (selectedPackage, splits, userId) => {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		// set source package
		const sourcePackage = await client.query(
			`SELECT * FROM packages WHERE id=$1 FOR UPDATE`,
			[selectedPackage.id],
		);

		if (sourcePackage.rows.length === 0) {
			throw new Error('Package not found');
		}

		const source = sourcePackage.rows[0];
		const parentStartingQty = parseFloat(source.quantity);

		const totalUsed = splits.reduce((sum, s) => sum + Number(s.totalWeight), 0);

		if (totalUsed > parentStartingQty) {
			throw new Error('Split exceeds available inventory');
		}
		const parentEndingQty = parentStartingQty - totalUsed;

		// create child packages
		for (const split of splits) {
			const childQty = split.totalWeight;

			const childResult = await client.query(
				`INSERT INTO packages
				(product_id, company_id, status, quantity, package_size, unit, parent_package_id, lot_number, cost_price, batch_id, package_tag, location_id)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
				[
					source.product_id,
					source.company_id,
					source.status,
					childQty,
					split.packageSize,
					source.unit,
					source.id,
					split.childLotNumber,
					source.cost_price,
					source.batch_id,
					split.package_tag,
					source.location_id,
				],
			);

			const childInventoryId = childResult.rows[0].id;

			await client.query(
				`INSERT INTO inventory_movements(packages_id, user_id, movement_type, quantity, cost_per_unit, starting_quantity, ending_quantity, company_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
				[
					childInventoryId,
					userId,
					'split',
					childQty,
					source.cost_price,
					0,
					childQty,
					selectedPackage.company_id,
				],
			);
		}

		//update source remaining qty
		await client.query(
			`UPDATE packages
			SET quantity = $1
			WHERE id=$2`,
			[parentEndingQty, source.id],
		);

		await client.query(
			`INSERT INTO inventory_movements(packages_id, user_id, movement_type, quantity, cost_per_unit, starting_quantity, ending_quantity, company_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
			[
				source.id,
				userId,
				'split_deduct',
				-totalUsed,
				source.cost_price,
				parentStartingQty,
				parentEndingQty,
				selectedPackage.company_id,
			],
		);

		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};

const activePackages = async (id) => {
	const { rows } = await pool.query(
		`SELECT COUNT(*) FROM packages WHERE product_id=$1 AND quantity > 0 AND status = 'active'`,
		[id],
	);
	return rows;
};

const applyInventoryMovement = async ({
	package_tag,
	product_id,
	packages_id = null,
	batch_id,
	company_id,
	location_id,
	batch,
	targetQty,
	movement_type,
	notes,
	cost_per_unit = null,
	userId,
	status,
	package_size,
	unit,
}) => {
	const client = await pool.connect();
	let delta;
	try {
		await client.query('BEGIN');

		let invId = packages_id;
		let newQty;
		let startingQty = 0;
		let endingQty = 0;
		delta = 0;
		let updateInventory;

		if (packages_id) {
			invId = packages_id;

			const { rows } = await client.query(
				`SELECT quantity FROM packages WHERE id=$1 FOR UPDATE`,
				[packages_id],
			);

			if (rows[0]?.locked) {
				throw new Error('Package is locked pending a transfer');
			}

			if (!rows.length) throw new Error('Inventory not found');

			startingQty = Number(rows[0].quantity);
			endingQty = Number(targetQty);
			delta = endingQty - startingQty;

			if (endingQty < 0) throw new Error('Inventory cannot be negative');

			newQty = endingQty;
			status = status || (newQty <= 0 ? 'inactive' : 'active');

			const { rows: updatedPackage } = await client.query(
				`UPDATE packages
				 SET quantity = $1,
				 unit = $2,
				 cost_price=COALESCE($3, cost_price),
				 status = $4
				 WHERE id=$5
				 RETURNING *;`,
				[endingQty, unit, cost_per_unit, status, packages_id],
			);

			await client.query(
				`INSERT INTO inventory_movements
     (packages_id, movement_type, quantity, cost_per_unit, notes, user_id, starting_quantity, ending_quantity, company_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
				[
					packages_id,
					movement_type,
					delta,
					cost_per_unit,
					notes,
					userId,
					startingQty,
					endingQty,
					company_id,
				],
			);
		} else {
			const { rows } = await client.query(
				`SELECT id, quantity FROM packages
     				WHERE package_tag = $1 FOR UPDATE`,
				[package_tag],
			);

			if (rows.length) {
				invId = rows[0].id;
				const currentQty = parseFloat(rows[0].quantity);
				delta = targetQty - currentQty;
				newQty = Number(targetQty);

				if (!status) status = newQty <= 0 ? 'inactive' : 'active';

				const { rows: updated } = await client.query(
					`UPDATE packages
           SET quantity=$1,
               cost_price=COALESCE($2, cost_price),
               supplier_name=COALESCE($3, supplier_name),
			   status = $4,
               updated_at=NOW()
           WHERE id=$5
		   RETURNING *;`,
					[newQty, cost_per_unit, null, status, invId],
				);
				updateInventory = updated[0];

				await client.query(
					`INSERT INTO inventory_movements
     (packages_id, movement_type, quantity, cost_per_unit, notes, user_id, starting_quantity, ending_quantity, company_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
					[
						invId,
						movement_type,
						delta,
						cost_per_unit,
						notes,
						userId,
						currentQty,
						newQty,
						company_id,
					],
				);
			} else {
				invId = null;
				delta = targetQty;
				const { rows: insertRows } = await client.query(
					`INSERT INTO packages
           ( product_id, package_tag, company_id, location_id, quantity, cost_price, package_size, lot_number, status, batch_id, unit)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11)
           RETURNING *`,
					[
						product_id,
						package_tag,
						company_id,
						location_id,
						targetQty,
						cost_per_unit,
						package_size,
						batch,
						status || (targetQty <= 0 ? 'inactive' : 'active'),
						batch_id,
						unit,
					],
				);
				updateInventory = insertRows[0];
				invId = insertRows[0].id;
				newQty = parseFloat(insertRows[0].quantity);

				// log movement
				await client.query(
					`INSERT INTO inventory_movements
     (packages_id, movement_type, quantity, cost_per_unit, notes, user_id, starting_quantity, ending_quantity, company_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
					[
						invId,
						movement_type,
						delta,
						cost_per_unit,
						notes,
						userId,
						startingQty,
						delta,
						company_id,
					],
				);
			}
		}

		await client.query('COMMIT');
		return {
			inventoryId: invId,
			startingQty,
			delta,
			endingQty: newQty,
			status: status,
		};
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
};

const getPackageByLot = async (productId, lotNumber) => {
	const { rows } = await pool.query(
		`SELECT * FROM packages WHERE product_id = $1 AND lot_number = $2`,
		[productId, lotNumber],
	);

	if (!rows || rows.length === 0) return null;

	return rows[0] || null;
};

const getPackage = async (packageId, companyId) => {
	const { rows } = await pool.query(
		`SELECT * FROM packages WHERE id=$1 AND company_id=$2`,
		[packageId, companyId],
	);
	return rows[0];
};

const adjustProductInventory = async (
	packages_id,
	movement_type,
	quantity,
	notes,
	userId,
) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const current = await client.query(
			`SELECT quantity FROM packages WHERE id=$1 FOR UPDATE`,
			[packages_id],
		);

		if (current.rows.length === 0) {
			throw new Error('Inventory record not found');
		}

		const startingQty = Number(current.rows[0].quantity);

		if (quantity < 0) {
			throw new Error('New quantity cannot be negative');
		}

		const endingQty = Number(quantity);
		const delta = endingQty - startingQty;

		const movementUpdate = await client.query(
			`
      INSERT INTO inventory_movements (
        packages_id,
        user_id,
        movement_type,
        starting_quantity,
        quantity,
        ending_quantity,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
			[
				packages_id,
				userId,
				movement_type,
				startingQty,
				delta,
				endingQty,
				notes,
			],
		);

		const inventoryUpdate = await client.query(
			`UPDATE packages
             SET quantity = $1
             WHERE id = $2`,
			[endingQty, packages_id],
		);

		await client.query('COMMIT');
		return movementUpdate.rows[0];
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
};

const receiveInventory = async (
	packages_id,
	quantity,
	batch,
	unit_price,
	vendor,
	reason = 'Receive',
	notes,
	userId,
) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const current = await client.query(
			`SELECT quantity FROM packages WHERE id=$1`,
			[packages_id],
		);

		if (current.rows.length === 0) {
			throw new Error('Inventory record not found');
		}

		if (quantity < 0) {
			throw new Error('Inventory cannot be negative');
		}

		const currentQty = current.rows[0].quantity;
		const delta = Number(quantity);
		const newQty = Number(currentQty) + delta;

		await client.query(
			`INSERT INTO inventory_movements (packages_id, movement_type, quantity, cost_per_unit, notes, user_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
			[packages_id, reason, delta, unit_price, notes, userId],
		);

		await client.query(
			`UPDATE packages
     SET quantity = $1,
         cost_price = $2,
         supplier_name = $3,
         lot_number = $4,
		 batch_id = $5
     WHERE id = $6`,
			[newQty, unit_price, vendor, batch, packages_id, batchId],
		);

		await client.query('COMMIT');
		return { newQty, delta };
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
};

const getInventoryId = async (productId) => {
	const { rows } = await pool.query(
		`SELECT * FROM packages WHERE product_id=$1`,
		[productId],
	);
	return rows;
};

module.exports = {
	getAllPackages,
	getPackagesByStatus,
	splitPackageTransaction,
	activePackages,
	applyInventoryMovement,
	getPackageByLot,
	getPackage,
	adjustProductInventory,
	receiveInventory,
	getInventoryId,
	getPackagesByProductId,
	getPackagesCountByStatus,
};
