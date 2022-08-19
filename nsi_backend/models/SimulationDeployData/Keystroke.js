const mongoose = require("mongoose");

// The fields of this data model come from the student simulator

const KeystrokeSchema = mongoose.Schema({
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
	keycode: {
		type: Boolean,
		required: true
	}
});

module.exports = KeystrokeSchema;