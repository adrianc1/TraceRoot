import { unarchiveProduct } from '../controllers/productsController';
import * as db from '../db/queries';
import { Request, Response } from 'express';

jest.mock('../db/queries');

const mockedDb = jest.mocked(db);

describe('unarchiveProduct', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			params: { id: '1' },
			user: { company_id: 5 } as any,
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('unarchives a product and returns 200', async () => {
		mockedDb.unarchiveProduct.mockResolvedValue({ success: true } as any);

		await unarchiveProduct(req as Request, res as Response);

		expect(mockedDb.unarchiveProduct).toHaveBeenCalledWith(1, 5);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ success: true });
	});
});
