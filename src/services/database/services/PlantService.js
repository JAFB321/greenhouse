const { DBService } = require('./DBService');
const Plant = require('../models/Plant');

const model = Plant.getInstance();

class PlantService extends DBService {
	constructor() {
		super(model);
	}
}

module.exports = {PlantService};
