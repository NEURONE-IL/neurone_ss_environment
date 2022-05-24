export class Simulation {

	_id?: string;
	name: string;
	description: string;
	numberStudents: number;
	numberDocuments: number;
	numberRelevantDocuments: number;
	randomActions: boolean;
	expiration: boolean;
	queryList: string[];
	behaviorModelId: string;
	length: number;
	sensibility: number;
	interval: number;
	speed: number;
	creationDate: string;
	lastDeployDate: string;
	lastModificationDate: string;

	constructor(_id: string, name: string, description: string, numberStudents: number, numberDocuments: number, numberRelevantDocuments: number, randomActions: boolean, expiration: boolean, queryList: string[], behaviorModelId: string, length: number, sensibility: number, interval: number, speed: number, creationDate: string, lastDeployDate: string, lastModificationDate: string) {
		this._id = _id;
		this.name = name;
		this.description = description;
		this.numberStudents = numberStudents;
		this.numberDocuments = numberDocuments;
		this.numberRelevantDocuments = numberRelevantDocuments;
		this.randomActions = randomActions;
		this.expiration = expiration;
		this.queryList = queryList;
		this.behaviorModelId = behaviorModelId;
		this.length = length;
		this.sensibility = sensibility;
		this.interval = interval;
		this.speed = speed;
		this.creationDate = creationDate
		this.lastDeployDate = lastDeployDate;
		this.lastModificationDate = lastModificationDate;
	}

}