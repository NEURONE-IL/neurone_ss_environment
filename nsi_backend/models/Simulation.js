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
	domain: {
		type: String,
		required: true
	},
	task: {
		type: String,
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
	// List of queries
	randomActions: {
		type: Boolean,
		required: true
	},
	// Behavior model
	length: {
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
	}
});

module.exports = mongoose.model("Simulation", SimulationSchema);