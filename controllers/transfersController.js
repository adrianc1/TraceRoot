const db = require('../db/queries');

const getAllTransfers = async (req, res) => {
	try {
		const transfers = await db.getAllTransfersDB(req.user.company_id);
		res.render('transfers/transfers', {
			transfers,
		});
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

		console.log('trasner shit!', transfer);

		if (!transfer) {
			return res.status(404).json({ error: 'Transfer not found' });
		}

		res.render('transfers/transfer', { transfer });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

const createTransferForm = async (req, res) => {
	try {
		const locations = await db.getLocations(req.user.company_id);
		const packages = await db.getPackagesByStatus(
			req.user.company_id,
			'active',
		);

		console.log('packages:', packages);

		res.render('transfers/createTransferForm', { locations, packages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

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

		res.redirect(`/transfers/${transfer.id}`);
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

module.exports = {
	getAllTransfers,
	getTransfer,
	createTransferForm,
	createTransfer,
	confirmTransfer,
	cancelTransfer,
};
