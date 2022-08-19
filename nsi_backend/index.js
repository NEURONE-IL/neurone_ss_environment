const express = require("express");
const connections_DB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

async function initializeMainRoutes () {
	const simulationRouter = await require("./routes/simulation");
	app.use("/api/simulations", simulationRouter);

	const behaviorModelRouter = await require("./routes/behaviorModel");
	app.use("/api/behaviormodels", behaviorModelRouter);

	const simulationDeployRouter = await require("./routes/simulationDeploy");
	app.use("/api/simulationdeploy", simulationDeployRouter);

	const simulationDeployDataRouter = await require("./routes/simulationDeployData");
	app.use("/api/simulationdeploydata", simulationDeployDataRouter);
};

initializeMainRoutes();

app.listen(4000, () => {
	console.log("Server is running");
})