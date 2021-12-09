const mongoose = require('mongoose');

const { Schema } = mongoose;

class Plant {
	constructor() {
		this.schema = new Schema({
			name: {
				type: String,
				required: true,
			},
			imageURL: {
				type: String,
				required: true,
			}
		});

		mongoose.model('Plant', this.schema);
	}

	getInstance() {
		return mongoose.model('Plant');
	}
}

module.exports = new Plant();
