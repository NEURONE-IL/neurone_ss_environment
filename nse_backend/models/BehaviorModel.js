const mongoose = require("mongoose");
require('dotenv').config({ path: 'settings.env' });

// Initializes the data model of a behavior model
async function initializeBehaviorModelModel () {

	const connections = await require("../config/db");

	const BehaviorModelSchema = mongoose.Schema({
		name: {					// Name of the behavior model
			type: String,
			required: true
		},
		fullModel: {			// Full JSON model to be used by JointJS in the diagram editor
			type: String,
			required: true
		},
		simulatorModel: {		// Simplified JSON model to be provided to the student simulator
			type: String,
			required: true
		},
		modelWidth: {			// Width of the model in pixels
			type: Number,
			required: true
		},
		modelHeight: {			// Height of the model in pixels
			type: Number,
			required: true
		},
		valid: {				// Whether the model is valid and therefore can be used in a simulation deploy
			type: Boolean,
			required: true
		},
		creationDate: {			// Date of creation
			type: Date,
			default: Date.now()
		},
		lastModificationDate: { // Date of last modification
			type: Date,
			required: true
		}
	});

	const databaseName = process.env.DB_MONGO_SIM_ENVIRONMENT_DATA.slice(10).split('/')[1];

	let neuroneSimEnvironmentDB = connections.DB_MONGO_SIM_ENVIRONMENT_DATA;
	neuroneSimEnvironmentDB.useDb(databaseName);
	let neuroneSimEnvironmentModel = neuroneSimEnvironmentDB.model("BehaviorModel", BehaviorModelSchema);

	return neuroneSimEnvironmentModel;

}

module.exports = initializeBehaviorModelModel();