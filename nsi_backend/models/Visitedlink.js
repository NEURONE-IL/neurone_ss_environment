const mongoose = require("mongoose");

const VisitedlinkSchema = mongoose.Schema({
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
	state: {
		type: String,
		required: true
	},
	localTimestamp: {
		type: Number,
		required: true
	},
	relevant: {
		type: Boolean,
		required: true
	}
});

const neuroneSimulatorDataDB = mongoose.connection.useDb("neuronesimulatordata");
module.exports = neuroneSimulatorDataDB.model("Visitedlink", VisitedlinkSchema);