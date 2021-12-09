require('dotenv').config();

const http = require('http');
const express = require('express');
const DBConnection = require('./services/database/connection');
const dataProcessing = require('./services/dataProcessing/dataProcessing');
const notifications = require('./services/notifications/notificationService');

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
const app = express(); 
const httpServer = http.createServer(app);

app.use(express.json());
app.use('/', express.static(__dirname + '/public'));


// app.listen(4000, () => console.log('Http server listening on port', 4000));
httpServer.listen(4000, () => console.log('Http server listening on port', httpServer.address().port));

// ----------- Data processing  -----------
const { RABBIT_URL, RABBIT_QUEUE } = process.env;

dataProcessing.setConfig({
    rabbitMQ_host: RABBIT_URL,
    rabbitMQ_queue: RABBIT_QUEUE
});

dataProcessing.init();

// ----------- Notifications Service ------------
notifications.setConfig({
    httpServer: httpServer
});

notifications.init(() => console.log("Notifications service running"));
