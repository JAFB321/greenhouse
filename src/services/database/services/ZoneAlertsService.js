const { DBService } = require('./DBService');
const ZoneAlerts = require('../models/ZoneAlerts');

const model = ZoneAlerts.getInstance();

class ZoneAlertsService extends DBService {
	constructor() {
		super(model);
	}

    async registerAlert(zoneID, sensorID, plantID, minValue, maxValue, date){
		try {
			let zoneAlert = (await this.model.find({ zoneID: zoneID }))[0];
			
            if(!zoneAlert){
                const newAlert = { 
                    zoneID: zoneID,
                    history: [{
                            plantID,
                            sensorID,
                            minValue,
                            maxValue,
                            date
                        }]
                };
                
                const createdAlert = await this.insert(newAlert);

                if(!createdAlert.error){
                    return {
						error: false,
						statusCode: 200,
					};
                }else return {
                    error: true,
                    statusCode: 404,
                }; 
                
             }

             zoneAlert = (await this.model.find({ zoneID: zoneID }))[0];

             if(zoneAlert){
                const {history} = zoneAlert;

                if(history === undefined){
                   zoneAlert.history = [];
                }
   
                zoneAlert.history.push({
                   plantID,
                   sensorID,
                   minValue,
                   maxValue,
                   date
               });
   
               const done = await zoneAlert.save();
   
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
            console.log(error);
			return {
				error: true,
				statusCode: 500,
			};
		}


	}
}

module.exports = {ZoneAlertsService};
