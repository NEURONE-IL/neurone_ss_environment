const express = require("express");
const router = express.Router();

// Initializes the routes of a simulation deploy
// (api/simulationdeploy)
async function initializeSimulationDeployRoutes () {

	const simulationDeployController = await require("../controllers/simulationDeployController");

	router.get("/start/:id", simulationDeployController.deploySimulation);
	router.get("/stop/:deployName", simulationDeployController.manuallyStopSimulation);

	return router;

};

module.exports = initializeSimulationDeployRoutes();