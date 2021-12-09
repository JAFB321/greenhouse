const mongoose = require('mongoose');

const { Schema } = mongoose;

class SensorReads {
	constructor() {
		this.schema = new Schema({
			sensorID: {
				type: mongoose.SchemaTypes.ObjectId,
				required: true,
			},
			reads: {
				type: [{
					value: Number,
					timestamp: Date
				}]
			}
		});

		mongoose.model('SensorReads', this.schema);
	}

	getInstance() {
		return mongoose.model('SensorReads');
	}
}

module.exports = new SensorReads();
