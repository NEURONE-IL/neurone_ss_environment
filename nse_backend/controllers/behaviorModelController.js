var Mutex = require("async-mutex").Mutex;
const mutex_behaviorModelDBChanges = new Mutex();

// Initializes the controller methods of a behavior model
async function initializeBehaviorModelController () {

	const BehaviorModel = await require("../models/BehaviorModel");

	let behaviorModelController = [];

	// Creates a new behavior model
	behaviorModelController.createBehaviorModel = exports.createBehaviorModel = async (req, res) => {

		mutex_behaviorModelDBChanges

			.runExclusive(async function() {

				try {
					let behaviorModel;

					behaviorModel = new BehaviorModel(req.body);

					await behaviorModel.save();
					res.send(behaviorModel);
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: createBehaviorModel method failed");
				}

			});

	};

	// Makes a copy of an existing behavior model
	behaviorModelController.copyBehaviorModel = exports.copyBehaviorModel = async (req, res) => {

		mutex_behaviorModelDBChanges

			.runExclusive(async function() {

				try {
					let originalBehaviorModel = await BehaviorModel.findById(req.body.id);

					if (!originalBehaviorModel) {
						res.status(404).json({msg: "Error: behavior model doesn't exist"});
						return;
					}

					let behaviorModels = await BehaviorModel.find();

					let name = originalBehaviorModel.name.concat(" " + req.body.copyText);

					let nameAlreadyExists = true;
					let copyCount = 1;

					while (nameAlreadyExists == true) {   
						nameAlreadyExists = false;
						for (let j = 0; j < behaviorModels.length; j++) {
						 	if (behaviorModels[j].name.toLowerCase() === name.trim().toLowerCase()) {
						    	nameAlreadyExists = true;
						    	copyCount = copyCount + 1;
						    	if (name.endsWith(req.body.copyText) == false) {
						    		name = name.substring(0, name.lastIndexOf(" "));
						    	}
						    	name = name.concat(" " + copyCount.toString());
						    	break;
						  	}
						}
					}

					let creationDate = new Date(Date.now());

					let newBehaviorModel = new BehaviorModel({
						name: name,
						fullModel: originalBehaviorModel.fullModel,
						simulatorModel: originalBehaviorModel.simulatorModel,
						modelWidth: originalBehaviorModel.modelWidth,
						modelHeight: originalBehaviorModel.modelHeight,
						valid: originalBehaviorModel.valid,
						creationDate: creationDate,
						lastModificationDate: creationDate
					})

					await newBehaviorModel.save();
					res.send(newBehaviorModel);
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: copyBehaviorModel method failed");
				}

			});

	};

	// Gets all behavior models
	behaviorModelController.getBehaviorModels = exports.getBehaviorModels = async (req, res) => {

		try {
			const behaviorModels = await BehaviorModel.find();
			res.json(behaviorModels);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getBehaviorModels method failed");
		}

	};

	// Gets the properties of all behavior models (all the metadata without the models themselves)
	behaviorModelController.getBehaviorModelsProperties = exports.getBehaviorModelsProperties = async (req, res) => {

		try {
			const behaviorModels = await BehaviorModel.find();
			let behaviorModelsProperties = [];
			for (let i = 0; i < behaviorModels.length; i++) {
		        behaviorModelsProperties.push({_id: behaviorModels[i]._id, name: behaviorModels[i].name, valid: behaviorModels[i].valid, creationDate: behaviorModels[i].creationDate});
		    }
			res.json(behaviorModelsProperties);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getBehaviorModelsIDsAndNames method failed");
		}

	};

	// Gets a single behavior model
	behaviorModelController.getBehaviorModel = exports.getBehaviorModel = async (req, res) => {

		try {
			let behaviorModel = await BehaviorModel.findById(req.params.id);

			if (!behaviorModel) {
				res.status(404).json({msg: "Error: Behavior model doesn't exist"});
				return;
			}
			
			res.json(behaviorModel);
		} catch (error) {
			console.log(error);
			res.status(500).send("Error: getBehaviorModel method failed");
		}

	};

	// Updates a behavior model
	behaviorModelController.updateBehaviorModel = exports.updateBehaviorModel = async (req, res) => {

		mutex_behaviorModelDBChanges

			.runExclusive(async function() {

				try {
					const { name, fullModel, simulatorModel, modelWidth, modelHeight, valid, lastModificationDate } = req.body;
					let behaviorModel = await BehaviorModel.findById(req.params.id);

					if (!behaviorModel) {
						res.status(404).json({msg: "Error: Behavior model doesn't exist"});
						return;
					}

					behaviorModel.name = name;
					behaviorModel.fullModel = fullModel;
					behaviorModel.simulatorModel = simulatorModel;
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

			});

	};

	// Deletes a single behavior model
	behaviorModelController.deleteBehaviorModel = exports.deleteBehaviorModel = async (req, res) => {

		mutex_behaviorModelDBChanges

			.runExclusive(async function() {

				try {
					let behaviorModel = await BehaviorModel.findById(req.params.id);

					if (!behaviorModel) {
						res.json({msg: "Behavior model doesn't exist" });
						return;
					}
					
					await BehaviorModel.findOneAndRemove({ _id: req.params.id });
					res.json({ msg: "Behavior model deleted" });
				} catch (error) {
					console.log(error);
					res.status(500).send("Error: deleteBehaviorModel method failed");
				}

			});

	};

	return behaviorModelController;

}

module.exports = initializeBehaviorModelController();