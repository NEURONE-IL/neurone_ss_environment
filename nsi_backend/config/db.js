const mongoose = require("mongoose");
require('dotenv').config({ path: 'settings.env' });

// Creates the database connections needed for the simulator environment to function
async function requestConnectDB() {

	try {

		let DB_MONGO_SIM_ENVIRONMENT_DATA = await mongoose.createConnection(process.env.DB_MONGO_SIM_ENVIRONMENT_DATA, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("Connected to MongoDB database (parameter DB_MONGO_SIM_ENVIRONMENT_DATA)");

		let DB_MONGO_SIM_APP_DATA = await mongoose.createConnection(process.env.DB_MONGO_SIM_APP_DATA, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("Connected to MongoDB deployment (parameter DB_MONGO_SIM_APP_DATA)");
		connections = {DB_MONGO_SIM_ENVIRONMENT_DATA, DB_MONGO_SIM_APP_DATA}
		return connections;

	} catch (error) {

		console.log(error);
		process.exit(1);

	}

}

module.exports = requestConnectDB();