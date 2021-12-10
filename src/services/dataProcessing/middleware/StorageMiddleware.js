const { IDataMiddleware, DataPackage } = require('./IDataMiddleware');
const { SensorService } = require('../../database/services/SensorService');
const { ZoneAlertsService } = require('../../database/services/ZoneAlertsService');

class StorageMiddleware extends IDataMiddleware {

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

        // if(dataPackage.metadata.errorType){
        //     const {zone, sensor} = dataPackage.metadata.errorInfo;
        //     const error = {
        //         zone,
        //         value,
        //         sensor,
        //     }
        //     // this.sockets.send(error);
        //     // this.sockets.sockets.emit('data', JSON.stringify(error));
        //     const {web, email} = dataPackage.metadata.notifs;

        //     if(web){
        //         this.notificationService.sendWebSocket(error);
        //     }

        //     if(email){
        //         this.notificationService.sendEmail(error);
        //     }
        //     console.log('notification error');
        // }

    }
}

module.exports = {
    StorageMiddleware
}