const express = require("express");
const router = express.Router();
const simulationDeployController = require("../controllers/simulationDeployController");

// api/simulationdata/deploy
router.get("/start/:id", simulationDeployController.startSimulationDeploy);
router.get("/stop/", simulationDeployController.stopSimulationDeploy);
router.get("/getbookmarks/", simulationDeployController.getBookmarks);
router.get("/getlatestbookmarks/:cursor", simulationDeployController.getLatestBookmarks);
router.get("/getkeystrokes/", simulationDeployController.getKeystrokes);
router.get("/getlatestkeystrokes/:cursor", simulationDeployController.getLatestKeystrokes);
router.get("/getqueries/", simulationDeployController.getQueries);
router.get("/getlatestqueries/:cursor", simulationDeployController.getLatestQueries);
router.get("/getvisitedlinks/", simulationDeployController.getVisitedlinks);
router.get("/getlatestvisitedlinks/:cursor", simulationDeployController.getLatestVisitedlinks);

module.exports = router;