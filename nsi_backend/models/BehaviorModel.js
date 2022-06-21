const mongoose = require("mongoose");

const BehaviorModelSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	fullModel: {
		type: String,
		required: true
	},
	simulatorModel: {
		type: String,
		required: true
	},
	modelWidth: {
		type: Number,
		required: true
	},
	modelHeight: {
		type: Number,
		required: true
	},
	valid: {
		type: Boolean,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now()
	},
	lastModificationDate: {
		type: Date,
		required: true
	}
});

const neuroneDB = mongoose.connection.useDb("neurone");
module.exports = neuroneDB.model("BehaviorModel", BehaviorModelSchema);