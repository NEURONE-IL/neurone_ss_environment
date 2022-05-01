const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

connectDB();
app.use(cors());

app.use(express.json());

app.use("/api/simulations", require("./routes/simulation"));
app.use("/api/behaviormodels", require("./routes/behaviorModel"));

app.listen(4000, () => {
	console.log("Server is running")
})