const mongoose = require("mongoose");

// The fields of this data model come from the student simulator

const QuerySchema = mongoose.Schema({
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

module.exports = QuerySchema;