const mongoose = require("mongoose");

// The fields of this data model come from the student simulator

const VisitedlinkSchema = mongoose.Schema({
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

module.exports = VisitedlinkSchema;