export class BehaviorModel {

	_id?: string;
	name: string;
	model: string;
	creationDate: string;

	constructor(_id: string, name: string, model: string, creationDate: string) {
		this._id = _id;
		this.name = name;
		this.model = model;
		this.creationDate = creationDate;
	}

}