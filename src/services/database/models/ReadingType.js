const mongoose = require('mongoose');

const { Schema } = mongoose;

class ReadingType{
	constructor() {
		this.schema = new Schema({
			name: {
				type: String,
			},
			measureUnit: {
				symbol: String,
				name: String,
			}
		});

		mongoose.model('ReadingType', this.schema);
	}

	getInstance() {
		return mongoose.model('ReadingType');
	}
}

module.exports = new ReadingType();
