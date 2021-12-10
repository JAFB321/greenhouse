const http = require('http');
const express = require('express');
const apiRoutes = require('./routes/index');


const { IService } = require("../IService");

class HttpAPIService extends IService {

    #app;
    #httpServer;
    #port = 4000;
    #jwt_secret_key;

    init(callback = (httpServer) => {}){
        this.#app = express();
        this.#httpServer = http.createServer(this.#app);

		this.#app.use(express.json());
		this.#app.use("/", express.static(__dirname + "/public"));

        // Api Routes
        this.#app.use('/api', apiRoutes);

        // JWT Token secret
        this.#app.set('JWT_SECRET_KEY', this.#jwt_secret_key);

		// app.listen(4000, () => console.log('Http server listening on port', 4000));
		this.#httpServer.listen(this.#port, callback);
    }

    restart(){

    }

    setConfig({port = 4000, jwt_secret_key}){
        this.#port = port;
        this.#jwt_secret_key = jwt_secret_key;
    }

    getHttpServer(){
        return this.#httpServer;
    }
}


module.exports = new HttpAPIService();