const mongoose = require("mongoose");

const BehaviorModelSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	model: {
		type: String,
		required: true
	},
	valid: {
		type: Boolean,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model("BehaviorModel", BehaviorModelSchema);