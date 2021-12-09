const { IService } = require('../IService');
const { Server:SocketIO } = require('socket.io');
const http = require('http');
const {MailIFTTT} = require('./Mail/IFTTT');

class NotificationService extends IService { 

    _httpServer;
    _sockets;

    constructor(){
        super();
        this._sockets = new SocketIO();
        this._httpServer = http.createServer();
    }

    /**
     * @param {{
         * httpServer: http.Server
         * }} config
     */
    setConfig(config = {}){
        const { httpServer } = config;
        this._httpServer = httpServer;
    }
    
    init(callback = () => {}){
        const sockets = new SocketIO(this._httpServer, {cors: {
                origin: '*',
            }
        });

        sockets.on("connection", (socket) => {
            console.log(10);
        });

        this._sockets = sockets;
        callback();
    }

    sendWebSocket(error){
        this._sockets.emit('data', JSON.stringify(error));
    }

    sendEmail(error){
        new MailIFTTT().sendEmail(error);
    }
}

const notificationService = new NotificationService();

module.exports = notificationService;
