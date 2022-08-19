const mongoose = require("mongoose");

// The fields of this data model come from the student simulator

const BookmarkSchema = mongoose.Schema({
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

module.exports = BookmarkSchema;