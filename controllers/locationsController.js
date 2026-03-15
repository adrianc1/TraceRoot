const db = require('../db/queries');

const getAllLocations = async (req, res) => {
	const locations = await db.getAllLocations(req.user.company_id);
	res.render('locations/locations', { locations });
};

const createLocationForm = async (req, res) => {
	res.render('locations/create-location');
};

const createLocation = async (req, res) => {
	try {
		const { name, description } = req.body;
		await db.insertLocation(name, description, req.user.company_id);
		res.status(201).json({ success: true });
	} catch (error) {
		if (error.code === '23505') {
			return res.status(400).json({ error: 'A location with that name already exists.' });
		}
		res.status(500).json({ error: 'Server error' });
	}
};

const editLocationForm = async (req, res) => {
	const location = await db.getLocationById(req.params.id, req.user.company_id);
	res.render('locations/edit-location', { location });
};

const updateLocation = async (req, res) => {
	try {
		const { name, description, is_active } = req.body;
		await db.updateLocation(name, description, is_active !== 'false', req.params.id, req.user.company_id);
		res.status(200).json({ success: true });
	} catch (error) {
		if (error.code === '23505') {
			return res.status(400).json({ error: 'A location with that name already exists.' });
		}
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = { getAllLocations, createLocationForm, createLocation, editLocationForm, updateLocation };
