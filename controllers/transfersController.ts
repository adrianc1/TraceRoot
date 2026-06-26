import { Request, Response } from 'express';
import * as db from '../db/queries';
import { toCsv, sendCsv } from '../utils/csvExport';

export const getAllTransfers = async (req: Request, res: Response) => {
	try {
		const transfers = await db.getAllTransfersDB(req.user!.company_id);
		res.json(transfers);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
};

export const getTransfer = async (req: Request, res: Response) => {
	try {
		const transfer = await db.getTransferByIdDB(
			Number(req.params.id),
			req.user!.company_id,
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

export const createTransfer = async (req: Request, res: Response) => {
	try {
		const companyId = req.user!.company_id;
		const createdBy = req.user!.id;
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
		res.status(500).json({ error: 'Failed to create transfer' });
	}
};

export const confirmTransfer = async (req: Request, res: Response) => {
	try {
		const transfer = await db.confirmTransferDB(
			Number(req.params.id),
			req.user!.company_id,
			req.user!.id,
		);

		if (!transfer) {
			return res
				.status(404)
				.json({ error: 'Transfer not found or already processed' });
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to confirm transfer' });
	}
};

export const cancelTransfer = async (req: Request, res: Response) => {
	try {
		const transfer = await db.cancelTransferDB(
			Number(req.params.id),
			req.user!.company_id,
		);

		if (!transfer) {
			return res
				.status(404)
				.json({ error: 'Transfer not found or already processed' });
		}

		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to cancel transfer' });
	}
};

export const exportTransfersCsv = async (req: Request, res: Response) => {
	try {
		const transfers = await db.getAllTransfersDB(req.user!.company_id);
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

export const transfersController = {
	getAllTransfers,
	getTransfer,
	createTransfer,
	confirmTransfer,
	cancelTransfer,
	exportTransfersCsv,
};
