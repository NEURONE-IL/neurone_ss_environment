const cmd = require("node-cmd");
const Bookmark = require("../models/Bookmark");
const Keystroke = require("../models/Keystroke");
const Query = require("../models/Query");
const Visitedlink = require("../models/Visitedlink");

exports.startSimulationDeploy = async (req, res) => {

	cmd.run(
		'sh ../../../Otros/neurone-am-simulator-v2/beginSimulation.sh',
		function(err, data, stderr) {
			res.json(data);
		}
	);

}

exports.stopSimulationDeploy = async (req, res) => {

	cmd.run(
		'sh ../../../Otros/neurone-am-simulator-v2/stopSimulation.sh',
		function(err, data, stderr) {
			res.json(data);
		}
	);

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