const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");

// api/simulations
router.post("/create/", simulationController.createSimulation);
router.get("/get/", simulationController.getSimulations);
router.get("/get/:id", simulationController.getSimulation);
router.put("/update/:id", simulationController.updateSimulation);
router.delete("/delete/:id", simulationController.deleteSimulation);

module.exports = router;