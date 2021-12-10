const Controller = require('./Controller');
const {SensorService} = require('../../database/services/SensorService');

const sensorService = new SensorService();

class SensorController extends Controller {
	constructor(service) {
		super(service);
	}
}

module.exports = new SensorController(sensorService);
