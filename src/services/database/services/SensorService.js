const {DBService} = require('./DBService');
const Sensor = require('../models/Sensor');
const ReadingType = require('../models/ReadingType');

const model = Sensor.getInstance();
const readTypesModel = ReadingType.getInstance();

class SensorService extends DBService {
	constructor() {
		super(model);
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
