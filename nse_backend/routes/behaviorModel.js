const express = require("express");
const router = express.Router();

// Initializes the routes of a behavior model
// (api/behaviormodels)
async function initializeBehaviorModelRoutes () {

	const behaviorModelController = await require("../controllers/behaviorModelController");

	router.post("/create/", behaviorModelController.createBehaviorModel);
	router.post("/copy/", behaviorModelController.copyBehaviorModel);
	router.get("/get/", behaviorModelController.getBehaviorModels);
	router.get("/getproperties/", behaviorModelController.getBehaviorModelsProperties);
	router.get("/get/:id", behaviorModelController.getBehaviorModel);
	router.put("/update/:id", behaviorModelController.updateBehaviorModel);
	router.delete("/delete/:id", behaviorModelController.deleteBehaviorModel);

	return router;

};

module.exports = initializeBehaviorModelRoutes();