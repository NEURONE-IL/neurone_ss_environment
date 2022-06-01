const mongoose = require('mongoose');
require('dotenv').config( {path: 'variables.env' });

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_MONGO_SIM_ENVIRONMENT_DATA, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("DB connected");

	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

module.exports = connectDB