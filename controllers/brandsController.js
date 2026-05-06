const db = require('../db/queries');

const getAllBrands = async (req, res) => {
	const brands = await db.getAllBrands(req.user.company_id);
	res.json(brands);
};

const createBrand = async (req, res) => {
	try {
		const { name, description } = req.body;
		await db.insertBrand(name, description, req.user.company_id);
		res.status(201).json({ success: true });
	} catch (error) {
		if (error.code === '23505') {
			return res
				.status(400)
				.json({ error: 'A brand with that name already exists.' });
		}
		res.status(500).json({ error: 'Server Error' });
	}
};

const getBrandById = async (req, res) => {
	const brand = await db.getBrandById(req.params.id, req.user.company_id);
	res.json(brand);
};

const updateBrand = async (req, res) => {
	try {
		const { name, description } = req.body;
		await db.updateBrand(name, description, req.params.id, req.user.company_id);
		res.status(200).json({ success: true });
	} catch (err) {
		if (err.code === '23505') {
			return res
				.status(400)
				.json({ error: 'A brand with that name already exists' });
		}
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = {
	getAllBrands,
	getBrandById,
	createBrand,
	updateBrand,
};
