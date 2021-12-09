const { IDataMiddleware, DataPackage } = require('./IDataMiddleware');
const { SensorService } = require('../../database/services/SensorService');

class StorageMiddleware extends IDataMiddleware {

    _sensorService;
    _zoneService;

    /**
     * @param {SensorService} sensorService
     * @param {ZoneService} zoneService
     */
     constructor(sensorService, zoneService) {
        super();
        this._sensorService = sensorService;
        this._zoneService = zoneService;
    }

    init(){

    }

    /**
     * @param {DataPackage} dataPackage
     */
    async onDataFlow(dataPackage){

        if(dataPackage.passed){
            const {sensorID, value} = dataPackage.data;

            const res = await this._sensorService.registerRead(sensorID, { 
                value: value,
                timestamp: Date.now()
            });

            dataPackage.metadata.saved = true;
        }

    }
}

module.exports = {
    StorageMiddleware
}