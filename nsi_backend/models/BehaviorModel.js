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

module.exports = mongoose.model("BehaviorModel", BehaviorModelSchema);