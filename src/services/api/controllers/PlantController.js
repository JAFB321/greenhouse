const Controller = require('./Controller');
const {PlantService} = require('../../database/services/PlantService');

const plantService = new PlantService();

class PlantController extends Controller {
	constructor(service) {
		super(service);
	}
}

module.exports = new PlantController(plantService);
