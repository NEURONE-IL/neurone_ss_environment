const mongoose = require("mongoose");

const KeystrokeSchema = mongoose.Schema({
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
	localtimestamp: {
		type: Number,
		required: true
	},
	keycode: {
		type: Boolean,
		required: true
	}
});

const neuroneSimulatorDataDB = mongoose.connection.useDb("neuronesimulatordata");
module.exports = neuroneSimulatorDataDB.model("Keystroke", KeystrokeSchema);