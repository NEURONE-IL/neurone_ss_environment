export class BehaviorModel {

	_id?: string;
	name: string;
	fullModel: string;
	simulatorModel: string;
	modelWidth: number;
	modelHeight: number;
	valid: boolean;
	creationDate: string;
	lastModificationDate: string;

	constructor(_id: string, name: string, fullModel: string, simulatorModel: string, modelWidth: number, modelHeight: number, valid: boolean, creationDate: string, lastModificationDate: string) {
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