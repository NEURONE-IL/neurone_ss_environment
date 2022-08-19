// Defines the data model for a behavior model
export class BehaviorModel {

	_id?: string;					// ID
	name: string;					// Name of the behavior model
	fullModel: string;				// Full JSON model to be used by JointJS in the diagram editor
	simulatorModel: string;			// Simplified JSON model to be provided to the student simulator
	modelWidth: number;				// Width of the full JSON model in pixels
	modelHeight: number;			// Height of the full JSON model in pixels
	valid: boolean;					// Whether the model is valid and therefore can be used in a simulation deploy
	creationDate: string;			// Date of creation
	lastModificationDate: string;	// Date of last modification

	constructor(_id: string,
				name: string,
				fullModel: string,
				simulatorModel: string,
				modelWidth: number,
				modelHeight: number,
				valid: boolean,
				creationDate: string,
				lastModificationDate: string) {
		this._id = _id;
		this.name = name;
		this.fullModel = fullModel;
		this.simulatorModel = simulatorModel;
		this.modelWidth = modelWidth;
		this.modelHeight = modelHeight;
		this.valid = valid;
		this.creationDate = creationDate;
		this.lastModificationDate = lastModificationDate;
	}

}