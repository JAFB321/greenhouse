const mongoose = require('mongoose');
const ReadingType = require('./ReadingType');

const { Schema } = mongoose;

class Sensor {
	constructor() {
		this.schema = new Schema({
			type: {
				type: String,
			},
			model: {
				type: String,
			},
			readingType:{
				type: ReadingType.schema
			},
			reads: [{
				value: Number,
				timestamp: Date
			}]
		});

		mongoose.model('Sensor', this.schema);
	}

	getInstance() {
		return mongoose.model('Sensor');
	}
}

module.exports = new Sensor();
