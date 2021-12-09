const mongoose = require('mongoose');

const { Schema } = mongoose;

class ZoneAlerts {
	constructor() {
		this.schema = new Schema({
			zoneID: {
				type: mongoose.SchemaTypes.ObjectId,
				required: true,
			},
			history: {
				type: [{
					plantID: mongoose.SchemaTypes.ObjectId,
					sensorID: mongoose.SchemaTypes.ObjectId,
					minValue: Number,
					maxValue: Number,
					date: Date
				}]
			}
		});

		mongoose.model('ZoneAlerts', this.schema);
	}

	getInstance() {
		return mongoose.model('ZoneAlerts');
	}
}

module.exports = new ZoneAlerts();
