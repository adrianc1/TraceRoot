const {
	getAllTransfers,
	getTransfer,
	createTransfer,
	confirmTransfer,
	cancelTransfer,
} = require('../../controllers/transfersController');
const db = require('../../db/queries');

jest.mock('../../db/queries');

describe('getAllTransfers Controller', () => {
	test('renders transfers list successfully', async () => {
		const mockTransfers = [
			{
				id: 1,
				transfer_type: 'internal',
				status: 'pending',
				from_location: 'Warehouse A',
				to_location: 'Warehouse B',
				package_count: 2,
				created_at: new Date(),
			},
		];
		db.getAllTransfersDB.mockResolvedValue(mockTransfers);

		const req = { user: { company_id: 1 } };
		const res = {
			render: jest.fn(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await getAllTransfers(req, res);

		expect(db.getAllTransfersDB).toHaveBeenCalledWith(1);
		expect(res.render).toHaveBeenCalledWith('transfers/transfers', {
			transfers: mockTransfers,
		});
	});

	test('returns 500 on error', async () => {
		db.getAllTransfersDB.mockRejectedValue(new Error('DB error'));

		const req = { user: { company_id: 1 } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

		await getAllTransfers(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
