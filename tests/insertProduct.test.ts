import { insertProduct } from '../controllers/productsController';
import * as db from '../db/queries';
import { Request, Response } from 'express';

jest.mock('../db/queries');

const mockedDb = jest.mocked(db);

describe('insertProduct', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		req = {
			body: {
				name: 'Test Product',
				description: 'Test Product Description',
				unit: 'each',
				brandId: 1,
				strainId: 1,
				categoryId: 1,
				sku: 'TEST-SKU',
			},

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

	test('creates a product and returns 201', async () => {
		mockedDb.insertProduct.mockResolvedValue({ id: 1 } as any);

		await insertProduct(req as Request, res as Response);

		expect(mockedDb.insertProduct).toHaveBeenCalledWith(
			'Test Product',
			'Test Product Description',
			'each',
			1,
			1,
			1,
			5,
			'TEST-SKU',
		);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ success: true, id: 1 });
	});
});
