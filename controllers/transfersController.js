const db = require('../db/queries');
const { toCsv, sendCsv } = require('../utils/csvExport');

const getAllTransfers = async (req, res) => {
	try {
		const transfers = await db.getAllTransfersDB(req.user.company_id);
		res.json(transfers);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const getTransfer = async (req, res) => {
	try {
		const transfer = await db.getTransferByIdDB(
			req.params.id,
			req.user.company_id,
		);

		if (!transfer) {
			return res.status(404).json({ error: 'Transfer not found' });
		}

		res.json(transfer);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

// const createTransferForm = async (req, res) => {
// 	try {
// 		const locations = await db.getLocations(req.user.company_id);
// 		const packages = await db.getPackagesByStatus(
// 			req.user.company_id,
// 			'active',
// 		);

// 		res.render('transfers/createTransferForm', { locations, packages });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: 'Database error' });
// 	}
// };

const createTransfer = async (req, res) => {
	try {
		const companyId = req.user.company_id;
		const createdBy = req.user.id;
		const {
			transfer_type,
			from_location_id,
			to_location_id,
			to_company_name,
			notes,
			items,
		} = req.body;

		if (!items || !items.length) {
			return res
				.status(400)
				.json({ error: 'At least one package is required' });
		}

		const transfer = await db.createTransferDB(
			companyId,
			transfer_type,
			from_location_id,
			to_location_id || null,
			to_company_name || null,
			notes,
			createdBy,
			items,
		);

		res.status(201).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

const confirmTransfer = async (req, res) => {
	try {
		const transfer = await db.confirmTransferDB(
			req.params.id,
			req.user.company_id,
			req.user.id,
		);

		if (!transfer) {
			return res
				.status(404)
				.json({ error: 'Transfer not found or already processed' });
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

const cancelTransfer = async (req, res) => {
	try {
		const transfer = await db.cancelTransferDB(
			req.params.id,
			req.user.company_id,
		);

		if (!transfer) {
			return res
				.status(404)
				.json({ error: 'Transfer not found or already processed' });
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

const exportTransfersCsv = async (req, res) => {
	try {
		const transfers = await db.getAllTransfersDB(req.user.company_id);
		const csv = toCsv(transfers, [
			{ header: 'ID', value: 'id' },
			{ header: 'Type', value: 'transfer_type' },
			{ header: 'From', value: 'from_location' },
			{
				header: 'To',
				value: (row) => row.to_location || row.to_company_name || '',
			},
			{ header: 'Package Count', value: 'package_count' },
			{ header: 'Status', value: 'status' },
			{
				header: 'Date',
				value: (row) =>
					row.created_at
						? new Date(row.created_at).toLocaleString('en-US')
						: '',
			},
		]);
		const date = new Date().toISOString().slice(0, 10);
		sendCsv(res, `transfers-${date}.csv`, csv);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Export failed' });
	}
};

module.exports = {
	getAllTransfers,
	getTransfer,
	createTransfer,
	confirmTransfer,
	cancelTransfer,
	exportTransfersCsv,
};
