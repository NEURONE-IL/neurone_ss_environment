export class BehaviorModel {

	_id: number;
	name: string;
	creationDate: string;

	constructor(_id: number, name: string, creationDate: string) {
		this._id = _id;
		this.name = name;
		this.creationDate = creationDate.toString();
	}

}