const db = require('../db/queries');

const getAllStrains = async (req, res) => {
	try {
		const strains = await db.getAllStrains(req.user.company_id);
		res.json(strains);
	} catch (error) {
		res.status(500).json({ error: 'Database error' });
	}
};

const getStrain = async (req, res) => {
	try {
		const strain = await db.getStrain(req.params.id, req.user.company_id);

		if (!strain) {
			res.status(404).json({ error: 'Strain not found' });
			return;
		}
		res.json(strain);
	} catch (error) {
		res.status(500).json({ error: 'Database error retreiving single product' });
	}
};

const insertStrain = async (req, res) => {
	try {
		const { name, description, type } = req.body;
		const result = await db.insertStrain(
			name,
			req.user.company_id,
			description,
			type,
		);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error inserting strain' });
	}
};

const updateStrain = async (req, res) => {
	const id = req.params.id;
	const { name, description } = req.body;
	await db.updateStrain(name, description, id);
	res.status(200).json({ success: true });
};

const deleteStrain = async (req, res) => {
	try {
		await db.deleteStrain(req.params.id);
		res.status(200).json({ success: true });
	} catch (error) {
		res.json({ error: 'there is an error.' });
	}
};

module.exports = {
	getAllStrains,
	getStrain,
	insertStrain,
	deleteStrain,
	updateStrain,
};
