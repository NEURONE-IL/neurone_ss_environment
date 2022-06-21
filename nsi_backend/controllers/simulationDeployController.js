const cmd = require("node-cmd");
const Simulation = require("../models/Simulation");
const BehaviorModel = require("../models/BehaviorModel");
const Bookmark = require("../models/Bookmark");
const Keystroke = require("../models/Keystroke");
const Query = require("../models/Query");
const Visitedlink = require("../models/Visitedlink");

require('dotenv').config( {path: 'variables.env' });

exports.startSimulationDeploy = async (req, res) => {

	try {

		let simulationJSON = {};

		let simulation = await Simulation.findById(req.params.id);

		if (!simulation) {
			res.status(404).json({msg: "Error: simulation doesn't exist"});
			return;
		}

		let behaviorModel = await BehaviorModel.findById(simulation.behaviorModelId);

		simulationJSON["probabilityGraph"] = JSON.parse(behaviorModel.simulatorModel);
		simulationJSON["random"] = simulation.randomActions;
		simulationJSON["expiration"] = simulation.expiration;
		simulationJSON["sensibility"] = simulation.sensibility;
		simulationJSON["interval"] = simulation.interval;
		simulationJSON["participantQuantity"] = simulation.numberStudents;
		simulationJSON["documentsQuantity"] = simulation.numberDocuments;
		simulationJSON["relevantsQuantity"] = simulation.numberRelevantDocuments;

		let queryList = [];
		for (let i = 0; i < simulation.queryList.length; i++) {
			queryList.push(simulation.queryList[i].replace('"', '\\"'));
		}
		simulationJSON["queryList"] = queryList;

		let database = {
			"databaseName": process.env.DB_MONGO_SIM_APP_DATA.slice(10).split('/')[1],
			"databaseUser": process.env.DB_MONGO_SIM_APP_DATA.slice(10).split(':')[0],
			"databasePassword": process.env.DB_MONGO_SIM_APP_DATA.split(':')[2].split('@')[0],
			"databaseHost": process.env.DB_MONGO_SIM_APP_DATA.split('@')[1].split('/')[0]
		};
		simulationJSON["database"] = database;

		let command = "curl -X POST " + process.env.SIMULATOR_URL + "/api/init/s1 -H \"Content-Type: application/json\" -d \'" + JSON.stringify(simulationJSON) + "\'";

		cmd.run(
			//	'sh ../../../Otros/neurone-am-simulator-v2/beginSimulation.sh',
		 	command,
		 	function(err, data, stderr) {
		 		res.json(data);
		 	}
		);

	} catch (error) {
		console.log(error);
		res.status(500).send("Error: startSimulationDeploy method failed");
	}

	// try {
	// 	let simulation = await Simulation.findById(req.params.id);

	// 	if (!simulation) {
	// 		res.status(404).json({msg: "Error: simulation doesn't exist"});
	// 		return;
	// 	}

	// 	let behaviorModel = await BehaviorModel.findById(simulation.behaviorModelId);

	// 	let probabilityGraph = behaviorModel.model.toSimulatorJSON();

	// 	let queryList = '[';
	// 	for (let i = 0; i < simulation.queryList.length; i++) {
	// 		queryList = queryList + '"' + simulation.queryList[i].replace('"', '\\"') + '", ';
	// 	}
	// 	queryList = queryList + '],';

	// 	let database = '{';
	// 	database = database + '"databaseName": "' + process.env.DB_MONGO_SIM_APP_DATA.slice(10).split('/')[1] + '", ';
	// 	database = database + '"databaseUser": "' + process.env.DB_MONGO_SIM_APP_DATA.slice(10).split(':')[0] + '", ';
	// 	database = database + '"databasePassword": "' + process.env.DB_MONGO_SIM_APP_DATA.split(':')[2].split('@')[0] + '", ';
	// 	database = database + '"databaseHost": "' + process.env.DB_MONGO_SIM_APP_DATA.split('@')[1].split('/')[0] + '"';
	// 	database = database + '}';

	// 	cmd.run(
	// 		'curl -X POST ' + process.env.SIMULATOR_URL + '/api/init/s1 -H "Content-Type: application/json" -d \'\
	// 		{\
	// 			"probabilityGraph": ' + probabilityGraph + ',' +
	// 		    '"random": ' + simulation.randomActions.toString() + ',' +
	// 		    '"expiration": true,' + simulation.expiration.toString() + ',' +
	// 		    '"sensibility": ' + simulation.sensibility.toString() + ',' +
	// 		    '"interval": ' + simulation.interval.toString() + ',' +
	// 		    '"participantQuantity": ' + simulation.numberStudents.toString() + ',' +
	// 		    '"documentsQuantity": ' + simulation.numberDocuments.toString() + ',' +
	// 		    '"relevantsQuantity": ' + simulation.numberRelevantDocuments.toString() + ',' +
	// 		    '"queryList": ' + queryList + ',' +
	// 		    '"database": ' + database + ',' +
	// 		'}',
	// 		function(err, data, stderr) {
	// 			res.json(data);
	// 		}
	// 	);
	// } catch (error) {
	// 	console.log(error);
	// 	res.status(500).send("Error: startSimulationDeploy method failed");
	// }

}

function toSimulatorJSON(behaviorModel) {
	return behaviorModel;
}

exports.stopSimulationDeploy = async (req, res) => {

	try {
		cmd.run(
			'curl -X GET ' + process.env.SIMULATOR_URL + 'api/stop/s1',
			function(err, data, stderr) {
				res.json(data);
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: stopSimulationDeploy method failed");
	}

}

exports.getBookmarks = async (req, res) => {

	try {
		const bookmarks = await Bookmark.find();
		res.json(bookmarks);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getBookmarks method failed");
	}

}

exports.getLatestBookmarks = async (req, res) => {

	try {
		const bookmarks = await Bookmark.find(
			{ localTimestamp: { $gt: req.params.cursor } }
		).sort( { localTimestamp: 1 } );
		res.json(bookmarks);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getLatestBookmarks method failed");
	}

}

exports.getKeystrokes = async (req, res) => {

	try {
		const keystrokes = await Keystroke.find();
		res.json(keystrokes);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getKeystrokes method failed");
	}

}


exports.getLatestKeystrokes = async (req, res) => {

	try {
		const keystrokes = await Keystroke.find(
			{ localTimestamp: { $gt: req.params.cursor } }
		).sort( { localTimestamp: 1 } );
		res.json(keystrokes);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getLatestKeystrokes method failed");
	}

}

exports.getQueries = async (req, res) => {

	try {
		const queries = await Query.find();
		res.json(queries);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getQueries method failed");
	}

}

exports.getLatestQueries = async (req, res) => {

	try {
		const queries = await Query.find(
			{ localTimestamp: { $gt: req.params.cursor } }
		).sort( { localTimestamp: 1 } );
		res.json(queries);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getLatestQueries method failed");
	}

}

exports.getVisitedlinks = async (req, res) => {

	try {
		const visitedlinks = await Visitedlink.find();
		res.json(visitedlinks);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getVisitedlinks method failed");
	}

}

exports.getLatestVisitedlinks = async (req, res) => {

	try {
		const visitedlinks = await Visitedlink.find(
			{ localTimestamp: { $gt: req.params.cursor } }
		).sort( { localTimestamp: 1 } );
		res.json(visitedlinks);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getLatestVisitedlinks method failed");
	}

}