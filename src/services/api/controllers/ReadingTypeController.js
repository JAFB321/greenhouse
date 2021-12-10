const Controller = require('./Controller');
const {ReadingTypeService} = require('../../database/services/ReadingTypeService');

const readingTypeService = new ReadingTypeService();

class ReadingTypeController extends Controller {
	constructor(service) {
		super(service);
	}
}

module.exports = new ReadingTypeController(readingTypeService);
