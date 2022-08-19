const cmd = require("node-cmd");
var mongoose = require('mongoose');
require('dotenv').config( {path: 'settings.env' });

var Mutex = require("async-mutex").Mutex;
global.mutex_simulationDeploy = new Mutex();

const intervalBetweenDeploysAndStops = 3000;

// Initializes the controller methods of a simulation deploy
async function initializeSimulationDeployController() {

	const connections = await require("../config/db");
	const Simulation = await require("../models/Simulation");
	const SimulationDeploy = await require("../models/SimulationDeploy");
	const BehaviorModel = await require("../models/BehaviorModel");

	let simulationDeployController = [];

	// Starts a simulation (deploys it), and saves the deploy information (the metadata) in the database
	simulationDeployController.deploySimulation = exports.deploySimulation = async (req, res) => {

		mutex_simulationDeploy

			.runExclusive(async function() {

				try {

					// Dropping orphan databases left from previous deploys

					await dropOrphanDatabases();

					// Determining the deploy name

					let deployName = "simulation_" + (new Date(Date.now())).getTime().toString();
					let simulationDeployNames = await getSimulationDeployNames();

					let nameInUse = true;
					let repeatedNameCount = 1;
					while (nameInUse == true) {
						if (simulationDeployNames.includes(deployName) == true) {
							if (deployName.charAt(deployName.length - 2) === "_") {
								deployName = deployName.slice(0, -1) + repeatedNameCount.toString();
							} else {
								deployName = deployName + "_" + repeatedNameCount.toString();
							}
							repeatedNameCount = repeatedNameCount + 1;
						} else {
							nameInUse = false;
						}
					}

					// Preparing the simulation deploy data

					let simulationJSON = {};

					let simulation = await Simulation.findById(req.params.id);

					if (!simulation) {
						res.status(404).json({msg: "Error: simulation doesn't exist"});
						return;
					}

					let behaviorModel = await BehaviorModel.findById(simulation.behaviorModelId);

					if (!behaviorModel) {
						res.status(404).json({msg: "Error: behavior model of the simulation doesn't exist"});
						return;
					}

					simulationJSON["probabilityGraph"] = JSON.parse(behaviorModel.simulatorModel);
					simulationJSON["random"] = simulation.randomActions;
					simulationJSON["expiration"] = simulation.expiration;
					simulationJSON["sensibility"] = simulation.sensibility;
					simulationJSON["interval"] = Math.round(simulation.interval / simulation.speed);
					simulationJSON["participantQuantity"] = simulation.numberStudents;
					simulationJSON["documentsQuantity"] = simulation.numberDocuments;
					simulationJSON["relevantsQuantity"] = simulation.numberRelevantDocuments;

					let queryList = [];
					for (let i = 0; i < simulation.queryList.length; i++) {
						queryList.push(simulation.queryList[i].replace('"', '\\"'));
					}
					simulationJSON["queryList"] = queryList;

					let databaseUser = process.env.DB_MONGO_SIM_APP_DATA.slice(10).split(':')[0];
					let databasePassword = process.env.DB_MONGO_SIM_APP_DATA.split(':')[2].split('@')[0];

					let database = {
						"databaseName": deployName,
						"databaseUser": databaseUser,
						"databasePassword": databasePassword,
						"databaseHost": process.env.DB_MONGO_SIM_APP_DATA.split('@')[1].split('/')[0]
					};
					simulationJSON["database"] = database;

					// Saving the deploy information in the simulator environment database

					creationDate = (new Date(Date.now())).toString();
					lastDataRequestDate = (new Date(0)).toString();
					simulationDeploy = new SimulationDeploy({ simulationId: req.params.id, deployName: deployName, status: "stopped", creationDate: creationDate, lastDataRequestDate: lastDataRequestDate });

					await simulationDeploy.save();

					// Initializing the database to store the simulator-generated student data

					const neuroneSimAppConn = connections.DB_MONGO_SIM_APP_DATA;
					const neuroneSimAppDB = neuroneSimAppConn.useDb(deployName);

					// Creating a user in the database, with the readWrite role needed by the simulator

					let userCreationCommand = "mongo \"" + process.env.DB_MONGO_SIM_APP_DATA + "\" -u " + databaseUser + " -p " + databasePassword + " --eval \"db.getSiblingDB('" + deployName + "').createUser({user: '" + databaseUser + "', pwd: '" + databasePassword + "', roles: ['readWrite']})\"";

					cmd.run(
					 	userCreationCommand,
					 	function(err, data, stderr) {
					 		console.log("MongoDB user creation output: " + data);

							// Deploying the simulation

							let simulationDeployCommand = "curl -X POST " + process.env.SIMULATOR_URL + "/api/init/" + deployName + " -H \"Content-Type: application/json\" -d \'" + JSON.stringify(simulationJSON) + "\'";

							cmd.run(
							 	simulationDeployCommand,
							 	async function(err, data, stderr) {
							 		console.log("Simulation deploy output: " + data);
									
									let simulationDeploy = await SimulationDeploy.find({ deployName: deployName });
									simulationDeploy = simulationDeploy[0];
									simulationDeploy.status = "deployed";
									await SimulationDeploy.findOneAndUpdate({ _id: simulationDeploy._id }, simulationDeploy, { new: true });

								 	automaticallyStopSimulation(simulationDeploy._id);

								 	await new Promise(f => setTimeout(f, this.intervalBetweenDeploysAndStops));

								 	res.json({
								 			msg: "Simulation deployed",
								 			deployName: simulationDeploy.deployName
								 	});
							 	}
							);
					 	}
					);

				} catch (error) {
					console.log(error);
					res.status(500).send("Error: startSimulationDeploy method failed");
				}

			});

	};

	// Stops a simulation by user request, and deletes the deploy information (the metadata) from the database
	simulationDeployController.manuallyStopSimulation = exports.manuallyStopSimulation = async (req, res) => {

		mutex_simulationDeploy

			.runExclusive(async function() {

				try {

					// Retrieving the simulation deploy data

					let simulationDeploy = await SimulationDeploy.find({ deployName: req.params.deployName });
					simulationDeploy = simulationDeploy[0];

					if (!simulationDeploy) {
						if (res != null) {
							res.status(404).json({msg: "Error: simulation deploy doesn't exist"});
						}
						return;
					}

					await SimulationDeploy.findOneAndRemove({ deployName: simulationDeploy.deployName });
					
					// Stopping the simulation

					let simulationStopCommand = 'curl -X GET ' + process.env.SIMULATOR_URL + 'api/stop/' + simulationDeploy.deployName;

					cmd.run(
					 	simulationStopCommand,
					 	function(err, data, stderr) {
							console.log("Simulation stop output: " + data);

							// Deleting the user previously created for the database

							let databaseUser = process.env.DB_MONGO_SIM_APP_DATA.slice(10).split(':')[0];
							let databasePassword = process.env.DB_MONGO_SIM_APP_DATA.split(':')[2].split('@')[0];

							let userDeletionCommand = "mongo \"" + process.env.DB_MONGO_SIM_APP_DATA + "\" -u " + databaseUser + " -p " + databasePassword + " --eval \"db.getSiblingDB('" + simulationDeploy.deployName + "').dropUser('" + databaseUser + "', {w: 'majority', wtimeout: 4000})\"";

							cmd.run(
							 	userDeletionCommand,
							 	async function(err, data, stderr) {
							 		console.log("MongoDB user deletion output: " + data);

									// Deleting the deploy information from the database

									let simulationDeployId = simulationDeploy._id.toString();
									await SimulationDeploy.findOneAndRemove({ _id: simulationDeployId });

									await new Promise(f => setTimeout(f, this.intervalBetweenDeploysAndStops));

									if (res != null) {
										res.json({ msg: "Simulation stopped" });
									}
							 	}
							);
					 	}
					);

				} catch (error) {
					console.log(error);
					if (res != null) {
						res.status(500).send("Error: stopSimulation method failed");
					}
				}

			});

	};

	// Stops a simulation automatically (when the frontend has not requested generated data for too long), and deletes the deploy information (the metadata) from the database
	automaticallyStopSimulation = async (simulationDeployId) => {

		const checkingFrequency = 30000;	// Time that must pass for the method to check the most recent simulation data requests that have been made (in milliseconds)
		const intervalToExceed = 60000;		// Maximum allowed time difference between the current date and the date of the last data request (in milliseconds)
		let status = "deployed";
		let intervalExceeded = false;
		while ((status !== "stopped") && (intervalExceeded == false)) {
      		await new Promise(f => setTimeout(f, checkingFrequency));
			let simulationDeploy = await SimulationDeploy.findById(simulationDeployId);
			if (!simulationDeploy) {
				return;
			}
			if (simulationDeploy.status === "stopped") {
				status = "stopped";
				continue;
			}
			let lastDataRequestDate = simulationDeploy.lastDataRequestDate.getTime();
			let currentDate = (new Date(Date.now())).getTime();
			if ((currentDate - lastDataRequestDate) > intervalToExceed) {
				intervalExceeded = true;
				let req = {};
				req.params = {deployName: simulationDeploy.deployName};
				simulationDeployController.manuallyStopSimulation(req, null);
				continue;
			}
		}

	};

	// Auxiliary method that gets the names of the simulation deploys currently stored in the database
	getSimulationDeployNames = async () => {

		try {
			const simulationDeploys = await SimulationDeploy.find();
			let simulationDeployNames = [];
			for (let i = 0; i < simulationDeploys.length; i++) {
				simulationDeployNames.push(simulationDeploys[i].deployName);
			}
			return simulationDeployNames;
		} catch (error) {
			console.log(error);
		}

	};

	// Auxiliary method that checks for, and removes, any databases that contain simulator-generated student data, but for which there are no associated entries in the simulationdeploys collection of the environment database (meaning those databases are no longer needed)
	dropOrphanDatabases = async () => {

		const neuroneSimAppConn = connections.DB_MONGO_SIM_APP_DATA;
		new mongoose.mongo.Admin(neuroneSimAppConn.db).listDatabases(async function(err, result) {
			const simulationDeploys = await SimulationDeploy.find();
			for (let i = 0; i < result.databases.length; i++) {
				if (result.databases[i].name.startsWith("simulation_") == true) {
					let simDeployDataFound = false;
					let simDeployName = '';
					for (let j = 0; j < simulationDeploys.length; j++) {
						if (simulationDeploys[j].deployName === result.databases[i].name) {
							simDeployDataFound = true;
							break;
						}
					}
					if (simDeployDataFound == false) {
						try {
							const neuroneSimAppDB = neuroneSimAppConn.useDb(result.databases[i].name);
							neuroneSimAppDB.db.dropDatabase();
						} catch (dbNotDropped) {
							console.log("Orphan database not dropped")
						}
					}
				}
			}
		});

	}

	return simulationDeployController;

}

module.exports = initializeSimulationDeployController();