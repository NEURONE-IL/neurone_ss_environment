export class BehaviorModel {

	_id?: string;
	name: string;
	model: string;
	valid: boolean;
	creationDate: string;

	constructor(_id: string, name: string, model: string, valid: boolean, creationDate: string) {
		this._id = _id;
		this.name = name;
		this.model = model;
		this.valid = valid;
		this.creationDate = creationDate;
	}

}