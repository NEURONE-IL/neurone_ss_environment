const mongoose = require("mongoose");

const BookmarkSchema = mongoose.Schema({
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
	action: {
		type: String,
		required: true
	},
	docid: {
		type: String,
		required: true
	},
	relevant: {
		type: Boolean,
		required: true
	},
	usermade: {
		type: Boolean,
		required: true
	}
});

const neuroneSimulatorDataDB = mongoose.connection.useDb("neuronesimulatordata");
module.exports = neuroneSimulatorDataDB.model("Bookmark", BookmarkSchema);