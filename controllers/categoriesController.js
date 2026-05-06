const db = require('../db/queries');

const getAllCategories = async (req, res) => {
	try {
		const categories = await db.getAllCategories(req.user.company_id);
		res.json(categories);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

const getCategory = async (req, res) => {
	try {
		const categoryId = req.params.id;
		const category = await db.getCategoryById(categoryId, req.user.company_id);
		const products = await db.getCategory(req.params.id, req.user.company_id);
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

// const editCategoryForm = async (req, res) => {
// 	let category = await db.getSingleCategory(req.params.id, req.user.company_id);

// 	if (!category) {
// 		res.status(404).json({ error: 'Category not found' });
// 		return;
// 	}

// 	res.render('categories/editCategoryForm', { category });
// };

const insertCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		const result = await db.insertCategory(
			name,
			req.user.company_id,
			description,
		);
		res.status(201).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

const updateCategory = async (req, res) => {
	const id = req.params.id;
	const { name, description } = req.body;
	await db.updateCategory(name, description, id);
	res.status(200).json({ success: true });
};

const getProductsByCategory = async (req, res) => {
	try {
		const products = await db.getCategory(req.params.id, req.user.company_id);
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
};

const deleteCategory = async (req, res) => {
	try {
		await db.deleteCategory(req.params.id);
		res.status(201).json({ success: true });
	} catch (error) {
		res.json({ error: 'there is an error.' });
	}
};

module.exports = {
	getAllCategories,
	getCategory,
	getProductsByCategory,
	insertCategory,
	deleteCategory,
	updateCategory,
};
