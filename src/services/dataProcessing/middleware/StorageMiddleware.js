const { IDataMiddleware, DataPackage } = require('./IDataMiddleware');
const { SensorService } = require('../../database/services/SensorService');
const { ZoneAlertsService } = require('../../database/services/ZoneAlertsService');

class StorageMiddleware extends IDataMiddleware {

    _current_date = new Date(2021, 1, 1);
    _reads_count = 0;

    _sensorService;
    _zoneService;
    _zoneAlertsService;

    /**
     * @param {SensorService} sensorService
     * @param {ZoneService} zoneService
     * @param {ZoneAlertsService} zoneAlertsService
     */
     constructor(sensorService, zoneService, zoneAlertsService) {
        super();
        this._sensorService = sensorService;
        this._zoneService = zoneService;
        this._zoneAlertsService = zoneAlertsService;
    }

    init(){

    }

    addDays(days) {
        var result = new Date(this._current_date);
        result.setDate(result.getDate() + days);
        this._current_date = result;

        if(this._current_date.getDate() == 1) console.log(this._current_date.toString());
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

        if(dataPackage.metadata.errorType){
            const {sensorID, value} = dataPackage.data;
            const {plantID, zoneID} = dataPackage.metadata.errorInfo;

            // console.log({
            //     sensorID,value,zoneID,plantID,
            // });

            const minValue = dataPackage.metadata.errorType === 'minval' ? value : null;
            const maxValue = dataPackage.metadata.errorType === 'maxval' ? value : null;
            
            this._zoneAlertsService.registerAlert(
                zoneID,
                sensorID,
                plantID,
                minValue,
                maxValue, 
                Date.now()
            );
        }

        
        // if(this._reads_count >= 100){
        //     this.addDays(1);
        //     this._reads_count = 0;
        // }
        // this._reads_count++;
    }
}

module.exports = {
    StorageMiddleware
}