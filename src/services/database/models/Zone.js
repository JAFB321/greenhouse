const mongoose = require('mongoose');
const Sensor = require('./Sensor');
const Plant = require('./Plant');

const { Schema } = mongoose;

class Zone {
	constructor() {
		this.schema = new Schema({
			name: {
				type: String,
				required: true,
			},
			sensors: {
				type: [Sensor.schema]
			},
			plants:{
				type: [Plant.schema]
			},
			alertParameters: {
				type:[{
					plantID: mongoose.SchemaTypes.ObjectId,
					readingTypeID: mongoose.SchemaTypes.ObjectId,
					minValue: Number,
					maxValue: Number,
					dangerLevel: Number,
					notifications:{
						priority: Number,
						email: Boolean,
						web: Boolean,
					}
				}]
			}
		});

		mongoose.model('Zone', this.schema);
	}

	getInstance() {
		return mongoose.model('Zone');
	}
}

module.exports = new Zone();
