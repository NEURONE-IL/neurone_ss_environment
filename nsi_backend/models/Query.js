const mongoose = require("mongoose");

const QuerySchema = mongoose.Schema({
	_id: {
		type: Object,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	localTimestamp: {
		type: Number,
		required: true
	},
	query: {
		type: String,
		required: true
	}
});

const neuroneSimulatorDataDB = mongoose.connection.useDb("neuronesimulatordata");
module.exports = neuroneSimulatorDataDB.model("Query", QuerySchema);