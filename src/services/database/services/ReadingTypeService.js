const {DBService} = require('./DBService');
const ReadingType = require('../models/ReadingType');

const model = ReadingType.getInstance();

class ReadingTypeService extends DBService {
	constructor() {
		super(model);
	}
}

module.exports = {ReadingTypeService};
