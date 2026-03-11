const pool = require('../pool');

const createTransferDB = async (
	companyId,
	transferType,
	fromLocationId,
	toLocationId,
	toCompanyName,
	notes,
	createdBy,
	items,
) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// validate packages belong to currnt company
		const packageIds = items.map((item) => item.package_id);
		const { rows: validPackages } = await client.query(
			`SELECT id FROM packages 
       WHERE id = ANY($1::int[]) 
       AND company_id = $2
       AND status = 'active'`,
			[packageIds, companyId],
		);

		if (validPackages.length !== packageIds.length) {
			throw new Error(
				'One or more packages are invalid or do not belong to this company',
			);
		}

		const transferResult = await client.query(
			`INSERT INTO transfers 
        (company_id, transfer_type, from_location_id, to_location_id, to_company_name, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
			[
				companyId,
				transferType,
				fromLocationId,
				toLocationId,
				toCompanyName,
				notes,
				createdBy,
			],
		);

		const transfer = transferResult.rows[0];

		for (const item of items) {
			const newQuantity = item.current_quantity - item.quantity;

			await client.query(
				`UPDATE packages
     SET 
       quantity = quantity - $1,
       status = CASE WHEN quantity - $1 <= 0 THEN 'inactive' ELSE status END
     WHERE id = $2`,
				[item.quantity, item.package_id],
			);

			await client.query(
				`INSERT INTO inventory_movements 
      (company_id, packages_id, user_id, movement_type, quantity, starting_quantity, ending_quantity, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[
					companyId,
					item.package_id,
					null,
					'transfer',
					item.quantity,
					item.current_quantity,
					newQuantity,
					`Transfer ID: ${transferId}`,
				],
			);
		}

		await client.query('COMMIT');
		return transfer;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};

const confirmTransferDB = async (transferId, companyId, confirmedBy) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// fetch and validate
		const { rows: transferRows } = await client.query(
			`SELECT * FROM transfers 
       WHERE id = $1 
       AND company_id = $2 
       AND status = 'pending'`,
			[transferId, companyId],
		);

		if (!transferRows.length) {
			throw new Error(
				'Transfer not found, already confirmed/cancelled, or unauthorized',
			);
		}

		const transfer = transferRows[0];
		const movementType =
			transfer.transfer_type === 'internal'
				? 'transfer_internal'
				: 'transfer_external';

		// fetch all packages with active qty
		const { rows: items } = await client.query(
			`SELECT ti.package_id, ti.quantity, p.quantity AS current_quantity
       FROM transfer_items ti
       JOIN packages p ON ti.package_id = p.id
       WHERE ti.transfer_id = $1`,
			[transferId],
		);

		// qty doesnt exceed
		for (const item of items) {
			if (item.quantity > item.current_quantity) {
				throw new Error(`Package ${item.package_id} has insufficient quantity`);
			}
		}

		// decrement pkg
		for (const item of items) {
			const newQuantity = item.current_quantity - item.quantity;

			await client.query(
				`UPDATE packages
         SET 
           quantity = quantity - $1,
           status = CASE WHEN quantity - $1 <= 0 THEN 'inactive' ELSE status END
         WHERE id = $2`,
				[item.quantity, item.package_id],
			);

			await client.query(
				`INSERT INTO inventory_movements 
          (company_id, packages_id, user_id, movement_type, quantity, starting_quantity, ending_quantity, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[
					companyId,
					item.package_id,
					confirmedBy,
					movementType,
					item.quantity,
					item.current_quantity,
					newQuantity,
					`Transfer ID: ${transferId}`,
				],
			);
		}

		// confirm transfer!
		const { rows: updated } = await client.query(
			`UPDATE transfers
       SET status = 'confirmed', confirmed_at = NOW()
       WHERE id = $1
       RETURNING *`,
			[transferId],
		);

		await client.query('COMMIT');
		return updated[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};

module.exports = { createTransferDB, confirmTransferDB };
