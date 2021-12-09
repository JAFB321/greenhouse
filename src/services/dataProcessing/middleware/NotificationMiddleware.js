const { IDataMiddleware, DataPackage } = require('./IDataMiddleware');
const { SensorService } = require('../../database/services/SensorService');

class NotificationMiddleware extends IDataMiddleware {

    notificationService;
    
    constructor(notificationService) {
        super();
        this.notificationService = notificationService;
    }

    init(){

    }

    /**
     * @param {DataPackage} dataPackage
     */
    async onDataFlow(dataPackage){

        if(dataPackage.passed){
            const {sensorID, value} = dataPackage.data;


            if(dataPackage.metadata.errorType){
                const {zone, sensor} = dataPackage.metadata.errorInfo;
                const error = {
                    zone,
                    value,
                    sensor,
                }
                // this.sockets.send(error);
                // this.sockets.sockets.emit('data', JSON.stringify(error));
                const {web, email} = dataPackage.metadata.notifs;

                if(web){
                    this.notificationService.sendWebSocket(error);
                }

                if(email){
                    this.notificationService.sendEmail(error);
                }
                console.log('notification error');
            }
        }

    }
}

module.exports = {
    NotificationMiddleware
}