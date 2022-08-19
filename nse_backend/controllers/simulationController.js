var Mutex = require("async-mutex").Mutex;
const mutex_simulationDBChanges = new Mutex();

// Initializes the controller methods of a simulation
async function initializeSimulationController() {

	const Simulation = await require("../models/Simulation");

	let simulationController = [];

	// Creates a new simulation
	simulationController.createSimulation = exports.createSimulation = async (req, res) => {

		mutex_simulationDBChanges

			.runExclusive(async function() {

				try {
					let simulation;

					simulation = new Simulation(req.body);

					await simulation.save();
					res.send(simulation);
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: createSimulation method failed");
				}

			});

	};

	// Makes a copy of an existing simulation
	simulationController.copySimulation = exports.copySimulation = async (req, res) => {
		
		mutex_simulationDBChanges

			.runExclusive(async function() {

				try {
					let originalSimulation = await Simulation.findById(req.body.id);

					if (!originalSimulation) {
						res.status(404).json({msg: "Error: simulation doesn't exist"});
						return;
					}

					let simulations = await Simulation.find();

					let name = originalSimulation.name.concat(" " + req.body.copyText);

					let nameAlreadyExists = true;
					let copyCount = 1;

					while (nameAlreadyExists == true) {   
						nameAlreadyExists = false;
						for (let j = 0; j < simulations.length; j++) {
						 	if (simulations[j].name.toLowerCase() === name.trim().toLowerCase()) {
						    	nameAlreadyExists = true;
						    	copyCount = copyCount + 1;
						    	if (name.endsWith(req.body.copyText) == false) {
						    		name = name.substring(0, name.lastIndexOf(" "));
						    	}
						    	name = name.concat(" " + copyCount.toString());
						    	break;
						  	}
						}
					}

					let creationDate = new Date(Date.now());

					let newSimulation = new Simulation({
						name: name,
						description: originalSimulation.description,
						numberStudents: originalSimulation.numberStudents,
						numberDocuments: originalSimulation.numberDocuments,
						numberRelevantDocuments: originalSimulation.numberRelevantDocuments,
						randomActions: originalSimulation.randomActions,
						expiration: originalSimulation.expiration,
						queryList: originalSimulation.queryList,
						behaviorModelId: originalSimulation.behaviorModelId,
						length: originalSimulation.length,
						sensibility: originalSimulation.sensibility,
						interval: originalSimulation.interval,
						speed: originalSimulation.speed,
						creationDate: creationDate,
						lastDeployDate: (new Date(0)).toString(),
						lastModificationDate: creationDate
					})

					await newSimulation.save();
					res.send(newSimulation);
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: copySimulation method failed");
				}

			});

	};
	
	// Gets all simulations
	simulationController.getSimulations = exports.getSimulations = async (req, res) => {

		try {
			const simulations = await Simulation.find();
			res.json(simulations);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getSimulations method failed");
		}

	};

	// Gets the names of all simulations
	simulationController.getSimulationNames = exports.getSimulationNames = async (req, res) => {

		try {
			const simulations = await Simulation.find();
			let simulationNames = [];
			for (let i = 0; i < simulations.length; i++) {
		        simulationNames.push(simulations[i].name);
		    }
			res.json(simulationNames);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getSimulationNames method failed");
		}

	};

	// Gets a single simulation
	simulationController.getSimulation = exports.getSimulation = async (req, res) => {

		try {
			let simulation = await Simulation.findById(req.params.id);

			if (!simulation) {
				res.status(404).json({msg: "Error: simulation doesn't exist"});
				return;
			}

			res.json(simulation);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getSimulation method failed");
		}

	};

	// Updates a simulation
	simulationController.updateSimulation = exports.updateSimulation = async (req, res) => {
		
		mutex_simulationDBChanges

			.runExclusive(async function() {

				try {
					const { name, description, numberStudents, numberDocuments, numberRelevantDocuments, randomActions, expiration, queryList, behaviorModelId, length, sensibility, interval, speed, lastDeployDate, lastModificationDate } = req.body;
					let simulation = await Simulation.findById(req.params.id);

					if (!simulation) {
						res.status(404).json({msg: "Error: simulation doesn't exist"});
						return;
					}

					simulation.name = name;
					simulation.description = description;
					simulation.numberStudents = numberStudents;
					simulation.numberDocuments = numberDocuments;
					simulation.numberRelevantDocuments = numberRelevantDocuments;
					simulation.randomActions = randomActions;
					simulation.expiration = expiration;
					simulation.queryList = queryList;
					simulation.behaviorModelId = behaviorModelId;
					simulation.length = length;
					simulation.sensibility = sensibility;
					simulation.interval = interval;
					simulation.speed = speed;
					simulation.lastDeployDate = lastDeployDate;
					simulation.lastModificationDate = lastModificationDate;

					simulation = await Simulation.findOneAndUpdate({ _id: req.params.id }, simulation, { new: true });
					res.json(simulation);
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: updateSimulation method failed");
				}

			});

	};

	// Updates the last deploy date of a simulation
	simulationController.updateSimulationLastDeployDate = exports.updateSimulationLastDeployDate = async (req, res) => {
		
		mutex_simulationDBChanges

			.runExclusive(async function() {

				try {
					let simulation = await Simulation.findById(req.params.id);

					if (!simulation) {
						res.status(404).json({msg: "Error: simulation doesn't exist"});
						return;
					}

					simulation.lastDeployDate = (new Date(Date.now())).toString();

					simulation = await Simulation.findOneAndUpdate({ _id: req.params.id }, simulation, { new: true });
					res.json(simulation);
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: updateSimulationLastDeployDate method failed");
				}

			});

	};

	// Deletes a single simulation
	simulationController.deleteSimulation = exports.deleteSimulation = async (req, res) => {
		
		mutex_simulationDBChanges

			.runExclusive(async function() {

				try {
					let simulation = await Simulation.findById(req.params.id);

					if (!simulation) {
						res.json({ msg: "Simulation doesn't exist" });
						return;
					}
					
					await Simulation.findOneAndRemove({ _id: req.params.id });
					res.json({ msg: "Simulation deleted" });				
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: deleteSimulation method failed");
				}

			});

	};

	// Gets a list of all simulation names and their respective behavior model IDs
	simulationController.getSimulationBehaviorModels = exports.getSimulationBehaviorModels = async (req, res) => {

		try {
			const simulations = await Simulation.find();
			let simulationBehaviorModels = [];
			for (let i = 0; i < simulations.length; i++) {
		        simulationBehaviorModels.push({simulationName: simulations[i].name, simulationBehaviorModelId: simulations[i].behaviorModelId});
		    }
			res.json(simulationBehaviorModels);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getSimulationBehaviorModels method failed");
		}

	};

	return simulationController;

}

module.exports = initializeSimulationController();