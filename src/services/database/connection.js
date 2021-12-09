const mongoose = require('mongoose');
const { IService } = require('../IService');

// Singleton mongoose connection instance
class DBConnection extends IService{
    setConfig({ URL, dbName, user, pass }){
		this.URL = URL;
		this.dbName = dbName;
		this.user = user;
		this.pass = pass;
    }

	init(){
		this._connect();
	}

	async _connect() {
		await mongoose.connect(`mongodb+srv://${this.user}:${this.pass}@cluster0.wurrl.mongodb.net/${this.dbName}?retryWrites=true&w=majority`);
		// await mongoose.connect(this.URL, {
		// 	dbName: ,
		// 	user: ,
		// 	pass: this.pass,
		// 	useNewUrlParser: true,
		// 	useUnifiedTopology: true,
		// });
		
	}
}

const DB = new  DBConnection();
module.exports = DB;