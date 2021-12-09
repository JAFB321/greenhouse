const { DBService } = require('./DBService');

const Zone = require('../models/Zone');
const { SensorService } = require('../services/SensorService');
const { PlantService } = require('../services/PlantService');


const model = Zone.getInstance();
const sensors = new SensorService();
const plants = new PlantService();

class ZoneService extends DBService {
	constructor() {
		super(model);
	}

    async insert(data){
        try {
            data.alertParameters = [];
            data.plants = [];
            data.sensors = [];

			let item = (await this.model.create(data))._doc;
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

	async addSensor(zoneID, sensorID){
        try {
            const { _id, type, readingType } = (await sensors.get(sensorID)).data;
            
            const sensor = {
                _id,
                type,
                readingType: {
                    _id: readingType?._id
                }
            }

            const zone = (await this.model.find({ _id: zoneID }))[0];

            if(!zone.sensors){
                zone.sensors = [];
            }

            zone.sensors.push(sensor);

			let done = await zone.save();
			if (done)
				return {
					error: false,
					statusCode: 202
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

    async addPlant(zoneID, plantID){
        try {
            const { _id, name, imageURL } = (await plants.get(plantID)).data;
            
            const plant = {
                _id,
                name,
                imageURL
            }

            const zone = (await this.model.find({ _id: zoneID }))[0];

            if(!zone.plants){
                zone.plants = [];
            }

            zone.plants.push(plant);

			let done = await zone.save();
			if (done)
				return {
					error: false,
					statusCode: 202
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

        /** 
     * 
     * @param {{
         * plantID: String
         * readingTypeID: String
         * dangerLevel: Number
         * minValue: Number
         * maxValue: Number
         * notifyPriority: Boolean
         * notifyEmail: Boolean
         * notifyWeb: Boolean
         * }} data
         */
    async addAlertParameter(zoneID, data){
        try {
            const { plantID, readingTypeID, dangerLevel, minValue, maxValue, notifyPriority, notifyEmail, notifyWeb} = data
            
            const alertParameters = {
                plantID,
                readingTypeID,
                dangerLevel,
                minValue, 
                maxValue,
                notifications: {
                    priority: notifyPriority,
                    email: notifyEmail,
                    web: notifyWeb
                }
            }

            const zone = (await this.model.find({ _id: zoneID }))[0];

            if(!zone.alertParameters){
                zone.alertParameters = [];
            }

            zone.alertParameters.push(alertParameters);

			let done = await zone.save();
			if (done)
				return {
					error: false,
					statusCode: 202
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
}



module.exports = { ZoneService };
