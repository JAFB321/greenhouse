const {DBService} = require('./DBService');
const Sensor = require('../models/Sensor');
const ReadingType = require('../models/ReadingType');

const model = Sensor.getInstance();
const readTypesModel = ReadingType.getInstance();

class SensorService extends DBService {
	constructor() {
		super(model);
	}

	async getAll(query = {}, skip, limit) {
		skip = skip ? Number(skip) : 0;
		limit = limit ? Number(limit) : 10;

		if (query._id) {
			try {
				query._id = new mongoose.mongo.ObjectId(query._id);
			} catch (error) {
				console.log('not able to generate mongoose id with content', query._id);
			}
		}

		try {
			let items = await this.model.find(query, '-reads').skip(skip).limit(limit);
			let total = await this.model.count();

			return {
				error: false,
				statusCode: 200,
				data: items.map((item) => item._doc),
				total,
			};
		} catch (error) {
			return {
				error: true,
				statusCode: 500,
				error,
			};
		}
	}

    async insert(data){
        try {

            const {readingType} = data;
            if(readingType){
                data.readingType = (await readTypesModel.find({
                     _id: readingType._id 
                    }
                ))[0]._doc;
            }

			let item = await this.model.create(data);
			if (item)
				return {
					error: false,
					item,
				};
		} catch (error) {
			console.log('error', error);
			return {
				error: true,
				statusCode: 500,
				message: error.errmsg || 'Not able to create item',
				errors: error.errors,
			};
		}
    }

	async registerRead(sensorID, readData){
		const {value, timestamp} = readData;

		try {
			const sensor = (await this.model.find({ _id: sensorID }))[0];
			
			if (sensor) {
				const { _id, reads } = sensor;

				if(reads === undefined){
					sensor.reads = [];
				}

				sensor.reads.push({
					value,
					timestamp
				});

				const done = await sensor.save();

				if (done) {
					return {
						error: false,
						statusCode: 200,
					};
				}
			}

			// Error
			return {
				error: true,
				statusCode: 404,
			};
		} catch (error) {
			return {
				error: true,
				statusCode: 500,
			};
		}


	}
}



module.exports = { SensorService };
