const mongoose = require("mongoose");

const BehaviorModelSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model("BehaviorModel", BehaviorModelSchema);