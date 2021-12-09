const { IDataMiddleware, DataPackage } = require('./IDataMiddleware');
const { SensorService } = require('../../database/services/SensorService');
const { ZoneService } = require('../../database/services/ZoneService');

class QualityMiddlewareState {
    zones;
    anomalies;

    constructor(){
        this.zones = [{
            _id: "",
            name: "",
            sensors: [{
                _id: "",
                type: "",
                readingType: {
                    _id: ""
                }
            }],
            plants: [{
                _id:"",
                name:"Tomato",
                imageURL:"",
            }],
            alertParameters: [{
                plantID: "",
                readingTypeID: "",
                minValue: 0,
                maxValue: 0,
                dangerLevel: 0,
                notifications:{
                    priority: 0,
                    email: false,
                    web: false
                }
            }]
        }];
        this.zones.pop();

        this.anomalies = {
            bad_count: 0,
            maxval_count: 0,
            minval_count: 0
        };
    }
}

class QualityMiddleware extends IDataMiddleware {

    _sensorService;
    _zoneService;
    _state;

    /**
     * @param {SensorService} sensorService
     * @param {ZoneService} zoneService
     */
    constructor(sensorService, zoneService) {
        super();
        this._sensorService = sensorService;
        this._zoneService = zoneService;
        this._state = new QualityMiddlewareState();
    }

    async init(){
        const {data: zones} = await this._zoneService.getAll();

        this._state.zones = zones.map((zone) => ({
            _id: zone._id,
            name: zone.name,
            sensors: [...zone.sensors],
            plants: [...zone.plants],
            alertParameters: [...zone.alertParameters]
        }));
    }

    /**
     * @param {DataPackage} dataPackage
     * @param {() => {}} next
     */
    async onDataFlow(dataPackage, next){
        await this.checkData(dataPackage);
        // next(dataPackage);
    }

     /**
     * @param {DataPackage} dataPackage
     */
    async checkData(dataPackage){
        const zones = this._state.zones;
        const {sensorID, value} = dataPackage.data;

        if(!sensorID && value == undefined){
            dataPackage.passed = false;
            dataPackage.metadata.errorType = "bad";
            this._state.anomalies.bad_count++;
            return;
        }

        for(let zone of zones){
            const {plants, sensors, alertParameters} = zone;

            const sensor = sensors.find((sensor) => {
                return sensor._id.toString() === sensorID;
            });
            if(!sensor || !sensor?._id) continue;

            const {readingType} = sensor;

            const alert = alertParameters.find((alert) => alert.readingTypeID.toString() === readingType._id.toString());
            if(!alert) continue;

            if(value < alert.minValue){
                this._state.anomalies.minval_count++;
                dataPackage.passed = false;

                if(this._state.anomalies.minval_count>3){
                    this._state.anomalies.minval_count = 0;
                    dataPackage.passed = true;
                    dataPackage.metadata.errorType = "minval";
                    dataPackage.metadata.errorInfo = {
                        zone: zone.name,
                        sensor: sensor.type
                    }
                    dataPackage.metadata.notifs = {
                        email: alert.notifications.email,
                        web: alert.notifications.web,
                    }
                }
            }

            if(value > alert.maxValue ){
                this._state.anomalies.maxval_count++;
                dataPackage.passed = false;

                if(this._state.anomalies.maxval_count>3){
                    this._state.anomalies.minval_count=0;
                    dataPackage.passed = true;
                    dataPackage.metadata.errorType = "maxval";
                    dataPackage.metadata.errorInfo = {
                        zone: zone.name,
                        sensor: sensor.type
                    }
                    dataPackage.metadata.notifs = {
                        email: alert.notifications.email,
                        web: alert.notifications.web,
                    }
                }
            }
        }
        
    }

}

module.exports = {
    QualityMiddleware
}