const Controller = require('./Controller');
const {ZoneService} = require('../../database/services/ZoneService');

const zoneService = new ZoneService();

class ZoneController extends Controller {
	constructor(service) {
		super(service);
	}

	// getWarnings = async (req, res) => {
	// 	const { id } = req.params;

	// 	const response = await this.service.getWarnings(id);
	// 	return res.status(response.statusCode).send(response);
	// };

	getAll = async (req, res) => {
		const { populated } = req.query;
		let response;

		if (populated) {
			response = await this.service.getAllPopulated();
		} else {
			response = await this.service.getAll(req.query);
		}
		return res.status(response.statusCode).send(response);
	};

	// getZoneHealth = async (req, res) => {
	// 	const { id } = req.params;

	// 	const response = await this.service.getZoneHealth(id);
	// 	return res.status(response.statusCode).send(response);
	// };

	addSensor = async (req, res) => {
		const { sensorId } = req.body;
		const { zoneId } = req.params;

		const response = await this.service.addSensor(zoneId, sensorId);
		return res.status(response.statusCode).send(response);
	};


	addPlant = async (req, res) => {
		const { plantID } = req.body;
		const { zoneId } = req.params;

		const response = await this.service.addPlant(zoneId, plantID);
		return res.status(response.statusCode).send(response);
	};

	addAlertParameter = async (req, res) => {
		const { zoneID } = req.params;

		const response = await this.service.addAlertParameter(zoneID, req.body);
		return res.status(response.statusCode).send(response);
	}

}

module.exports = new ZoneController(zoneService);
