const auth = require('./auth');
const batches = require('./batches');
const brands = require('./brands');
const categories = require('./categories');
const inventory = require('./inventory');
const locations = require('./locations');
const packages = require('./packages');
const products = require('./products');
const strains = require('./strains');
const transfers = require('./transfers');
const users = require('./users');
const invites = require('./invites');

module.exports = {
	...auth,
	...batches,
	...brands,
	...categories,
	...inventory,
	...locations,
	...packages,
	...products,
	...strains,
	...transfers,
	...users,
	...invites,
};
