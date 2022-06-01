const mongoose = require("mongoose");

const SimulationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	numberStudents: {
		type: Number,
		required: true
	},
	numberDocuments: {
		type: Number,
		required: true
	},
	numberRelevantDocuments: {
		type: Number,
		required: true
	},
	randomActions: {
		type: Boolean,
		required: true
	},
	expiration: {
		type: Boolean,
		required: true
	},
	queryList: {
		type: [String],
		required: true
	},
	behaviorModelId: {
		type: String,
		required: true
	},
	length: {
		type: Number,
		required: true
	},
	sensibility: {
		type: Number,
		required: true
	},
	interval: {
		type: Number,
		required: true
	},
	speed: {
		type: Number,
		required: true
	},
	creationDate: {
		type: Date,
		required: true
	},
	lastDeployDate: {
		type: Date,
		required: true
	},
	lastModificationDate: {
		type: Date,
		required: true
	}
});

const neuroneDB = mongoose.connection.useDb("neurone");
module.exports = neuroneDB.model("Simulation", SimulationSchema);