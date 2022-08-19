const express = require("express");
const router = express.Router();

// Initializes the routes of the simulation deploy data
// (api/simulationdeploydata)
async function initializeSimulationDeployDataRoutes () {

	const simulationDeployDataController = await require("../controllers/simulationDeployDataController");

	router.get("/getlatestbookmarks/:deployName/:cursor", simulationDeployDataController.getLatestBookmarks);
	router.get("/getlatestkeystrokes/:deployName/:cursor", simulationDeployDataController.getLatestKeystrokes);
	router.get("/getlatestqueries/:deployName/:cursor", simulationDeployDataController.getLatestQueries);
	router.get("/getlatestvisitedlinks/:deployName/:cursor", simulationDeployDataController.getLatestVisitedlinks);

	return router;

};

module.exports = initializeSimulationDeployDataRoutes();