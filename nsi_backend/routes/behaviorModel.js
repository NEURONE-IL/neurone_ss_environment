const express = require("express");
const router = express.Router();
const behaviorModelController = require("../controllers/behaviorModelController");

// api/behaviormodels
router.post("/create/", behaviorModelController.createBehaviorModel);
router.get("/get/", behaviorModelController.getBehaviorModels);
router.get("/get/:id", behaviorModelController.getBehaviorModel);
router.put("/update/:id", behaviorModelController.updateBehaviorModel);
router.delete("/delete/:id", behaviorModelController.deleteBehaviorModel);

module.exports = router;