const { IService } = require('../IService')
const { IDataMiddleware, DataPackage } = require('./middleware/IDataMiddleware');
const { QualityMiddleware } = require('./middleware/QualityMiddleware');
const { NotificationMiddleware } = require('./middleware/NotificationMiddleware');
const { StorageMiddleware } = require('./middleware/StorageMiddleware');
const { QueueConsumer } = require('./RabbitMQ/QueueConsumer');

const notificationsService = require('../notifications/notificationService');

const { SensorService } = require('../database/services/SensorService')
const { ZoneService } = require('../database/services/ZoneService')

const zones = new ZoneService();
const sensors = new SensorService();

class DataProcessingService extends IService { 

    middlewares;
    dataQueue;

    constructor(){
        super();
        this.middlewares = [new IDataMiddleware()];
        this.middlewares.pop();
        this.dataQueue = new QueueConsumer();
    }

    /**
     * @param {IDataMiddleware} middleware
         */
    addMiddleware(middleware){
        this.middlewares.push(middleware);
    }
    
    /**
     * 
     * @param {{
     * rabbitMQ_host: String
     * rabbitMQ_queue: String
     * }} config
     */
    setConfig(config) {
        const {rabbitMQ_host, rabbitMQ_queue} = config || {};
        this.rabbitMQ_host = rabbitMQ_host;
        this.rabbitMQ_queue = rabbitMQ_queue;

        this.dataQueue = new QueueConsumer({
            HOST: rabbitMQ_host,
            Queue: rabbitMQ_queue,
        });

    }

    init(){
        this._init();
    }

    async _init(){
        await this.dataQueue.init();
        await this._initMiddlewares();
        await this._initQueue();
    }

    async _initMiddlewares(){
        for (const middleware of this.middlewares) {
            await middleware.init();
        }
    }

    async _initQueue(){
        this.dataQueue.consume(async (msg) => {
            await this._processData(msg);
        });
    }

    async _processData(data){
        const json = JSON.parse(data);
        const dataPackage = new DataPackage(json);

        for (const middleware of this.middlewares) {
            await middleware.onDataFlow(dataPackage);
        }
    }   
}

const dataProcessingService = new DataProcessingService(); 

const quality = new QualityMiddleware(sensors, zones);
dataProcessingService.addMiddleware(quality);

const notifications = new NotificationMiddleware(notificationsService);
dataProcessingService.addMiddleware(notifications);

const storage = new StorageMiddleware(sensors, zones);
dataProcessingService.addMiddleware(storage);

module.exports = dataProcessingService;
