const Simulation = require("../models/Simulation");

exports.createSimulation = async (req, res) => {

	try {
		let simulation;

		// Creating simulation
		simulation = new Simulation(req.body);

		await simulation.save();
		res.send(simulation);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: createSimulation method failed");
	}

}

exports.getSimulations = async (req, res) => {

	try {
		const simulations = await Simulation.find();
		res.json(simulations);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getSimulations method failed");
	}

}

exports.getSimulation = async (req, res) => {

	try {
		let simulation = await Simulation.findById(req.params.id);

		if (!simulation) {
			res.status(404).json({msg: "Error: simulation doesn't exist"});
		}

		res.json(simulation);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getSimulation method failed");
	}

}

exports.updateSimulation = async (req, res) => {

	try {
		const { name, description, numberStudents, domain, task, numberDocuments, numberRelevantDocuments, randomActions, expiration, queryList, behaviorModelId, length, sensibility, interval, speed, lastDeployDate } = req.body;
		let simulation = await Simulation.findById(req.params.id);

		if (!simulation) {
			res.status(404).json({msg: "Error: simulation doesn't exist"});
		}

		simulation.name = name;
		simulation.description = description;
		simulation.numberStudents = numberStudents;
		simulation.domain = domain;
		simulation.task = task;
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

		simulation = await Simulation.findOneAndUpdate({ _id: req.params.id }, simulation, { new: true });
		res.json(simulation);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: updateSimulation method failed");
	}

}

exports.deleteSimulation = async (req, res) => {

	try {
		let simulation = await Simulation.findById(req.params.id);

		if (!simulation) {
			res.status(404).json({msg: "Error: simulation doesn't exist"});
		}

		await Simulation.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: "Simulation deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: deleteSimulation method failed");
	}

}