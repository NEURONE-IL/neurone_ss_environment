const BehaviorModel = require("../models/BehaviorModel");

exports.createBehaviorModel = async (req, res) => {

	try {
		let behaviorModel;

		// Creating behavior model
		behaviorModel = new BehaviorModel(req.body);

		await behaviorModel.save();
		res.send(behaviorModel);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: createBehaviorModel method failed");
	}

}

exports.getBehaviorModels = async (req, res) => {

	try {
		const behaviorModels = await BehaviorModel.find();
		res.json(behaviorModels);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getBehaviorModels method failed");
	}

}

exports.getBehaviorModelsProperties = async (req, res) => {

	try {
		const behaviorModels = await BehaviorModel.find();
		let behaviorModelsProperties = [];
		for (let i = 0; i < behaviorModels.length; i++) {
	        behaviorModelsProperties.push({_id: behaviorModels[i]._id, name: behaviorModels[i].name, valid: behaviorModels[i].valid});
	    }
		res.json(behaviorModelsProperties);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getBehaviorModelsIDsAndNames method failed");
	}

}

exports.getBehaviorModel = async (req, res) => {

	try {
		let behaviorModel = await BehaviorModel.findById(req.params.id);

		if (!behaviorModel) {
			res.status(404).json({msg: "Error: Behavior model doesn't exist"});
		}

		res.json(behaviorModel);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: getBehaviorModel method failed");
	}

}

exports.updateBehaviorModel = async (req, res) => {

	try {
		const { name, model, modelWidth, modelHeight, valid, lastModificationDate } = req.body;
		let behaviorModel = await BehaviorModel.findById(req.params.id);

		if (!behaviorModel) {
			res.status(404).json({msg: "Error: Behavior model doesn't exist"});
		}

		behaviorModel.name = name;
		behaviorModel.model = model;
		behaviorModel.modelWidth = modelWidth;
		behaviorModel.modelHeight = modelHeight;
		behaviorModel.valid = valid;
		behaviorModel.lastModificationDate = lastModificationDate;

		behaviorModel = await BehaviorModel.findOneAndUpdate({ _id: req.params.id }, behaviorModel, { new: true });
		res.json(behaviorModel);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: updateBehaviorModel method failed");
	}

}

exports.deleteBehaviorModel = async (req, res) => {

	try {
		let behaviorModel = await BehaviorModel.findById(req.params.id);

		if (!behaviorModel) {
			res.status(404).json({msg: "Error: Behavior model doesn't exist"});
		}

		await BehaviorModel.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: "Behavior model deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error: deleteBehaviorModel method failed");
	}

}