const mongoose = require("mongoose");
require('dotenv').config({ path: 'settings.env' });

// Initializes the data model of a simulation
async function initializeSimulationModel() {

	const connections = await require("../config/db");

	const SimulationSchema = mongoose.Schema({
		name: {						// Name of the simulation
			type: String,
			required: true
		},
		description: {				// A description of the simulation
			type: String,
			required: true
		},
		numberStudents: {			// Number of students in the simulation
			type: Number,
			required: true
		},
		numberDocuments: {			// Number of documents that the students can explore
			type: Number,
			required: true
		},
		numberRelevantDocuments: {	// Number of relevant documents
			type: Number,
			required: true
		},
		randomActions: {			// Whether the simulation will use the behavior model or not
			type: Boolean,
			required: true
		},
		expiration: {				// Unused option
			type: Boolean,
			required: true
		},
		queryList: {				// List of queries for the simulation
			type: [String],
			required: true
		},
		behaviorModelId: {			// ID of the behavior model of the simulation
			type: String,
			required: true
		},
		length: {					// Running time of the simulation
			type: Number,
			required: true
		},
		sensibility: {				// Probability of a student performing an action at a specific moment in time
			type: Number,
			required: true
		},
		interval: {					// Time that must be elapsed between student actions
			type: Number,
			required: true
		},
		speed: {					// Number that the interval is divided by
			type: Number,
			required: true
		},
		creationDate: {				// Date of creation
			type: Date,
			required: true
		},
		lastDeployDate: {			// Date of last deploy
			type: Date,
			required: true
		},
		lastModificationDate: {		// Date of last modification
			type: Date,
			required: true
		}
	});

	const databaseName = process.env.DB_MONGO_SIM_ENVIRONMENT_DATA.slice(10).split('/')[1];

	let neuroneSimEnvironmentDB = connections.DB_MONGO_SIM_ENVIRONMENT_DATA;
	neuroneSimEnvironmentDB.useDb(databaseName);
	let neuroneSimEnvironmentModel = neuroneSimEnvironmentDB.model("Simulation", SimulationSchema);

	return neuroneSimEnvironmentModel;

}

module.exports = initializeSimulationModel();