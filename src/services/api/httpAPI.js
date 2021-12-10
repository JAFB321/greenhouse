const http = require('http');
const express = require('express');

const { IService } = require("../IService");

class HttpAPIService extends IService {

    #app;
    #httpServer;
    #port = 4000;

    init(callback = (httpServer) => {}){
        this.#app = express();
        this.#httpServer = http.createServer(this.#app);

		this.#app.use(express.json());
		this.#app.use("/", express.static(__dirname + "/public"));

		// app.listen(4000, () => console.log('Http server listening on port', 4000));
		this.#httpServer.listen(this.#port, callback);
    }

    restart(){

    }

    setConfig({port = 4000}){
        this.#port = port;
    }

    getHttpServer(){
        return this.#httpServer;
    }
}


module.exports = new HttpAPIService();