const express = require("express");
const router = express.Router();

// Initializes the routes of a simulation
// (api/simulations)
async function initializeSimulationRoutes () {

	const simulationController = await require("../controllers/simulationController");

	router.post("/create/", simulationController.createSimulation);
	router.post("/copy/", simulationController.copySimulation);
	router.get("/get/", simulationController.getSimulations);
	router.get("/getnames/", simulationController.getSimulationNames);
	router.get("/getmodels/", simulationController.getSimulationBehaviorModels);
	router.get("/get/:id", simulationController.getSimulation);
	router.put("/update/:id", simulationController.updateSimulation);
	router.put("/updatelastdeploydate/:id", simulationController.updateSimulationLastDeployDate);
	router.delete("/delete/:id", simulationController.deleteSimulation);

	return router;

};

module.exports = initializeSimulationRoutes();