require('dotenv').config();


const DBConnection = require('./services/database/connection');
const dataProcessing = require('./services/dataProcessing/dataProcessing');
const notifications = require('./services/notifications/notificationService');
const httpAPI = require('./services/api/httpAPI');

// ---------- Database Service ----------
const {DB_URL, DB_NAME, DB_USER, DB_PASS} = process.env;

DBConnection.setConfig({
    URL: DB_URL,
    dbName: DB_NAME,
    user: DB_USER,
    pass: DB_PASS
});
DBConnection.init();


// ---------- Http server ------------------
httpAPI.setConfig({
    port: process.env.PORT || 4000
});
httpAPI.init((http) => console.log("Http server service running on port "));

// ----------- Data processing  -----------
const { RABBIT_URL, RABBIT_QUEUE } = process.env;

dataProcessing.setConfig({
    rabbitMQ_host: RABBIT_URL,
    rabbitMQ_queue: RABBIT_QUEUE
});

dataProcessing.init();

// ----------- Notifications Service ------------
notifications.setConfig({
    httpServer: httpAPI.getHttpServer()
});

notifications.init(() => console.log("Notifications service running"));

console.log('finished');