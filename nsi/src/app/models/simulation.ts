export class Simulation {

	_id?: number;
	name: string;
	description: string;
	numberStudents: number;
	domain: string;
	task: string;
	numberDocuments: number;
	numberRelevantDocuments: number;
	randomActions: boolean;
	length: number;
	interval: number;
	speed: number;
	creationDate: string;
	lastDeployDate: string;

	constructor(_id: number, name: string, description: string, numberStudents: number, domain: string, task: string, numberDocuments: number, numberRelevantDocuments: number, randomActions: boolean, length: number, interval: number, speed: number, creationDate: string, lastDeployDate: string) {
		this._id = _id;
		this.name = name;
		this.description = description;
		this.numberStudents = numberStudents;
		this.domain = domain;
		this.task = task;
		this.numberDocuments = numberDocuments;
		this.numberRelevantDocuments = numberRelevantDocuments;
		this.randomActions = randomActions;
		this.length = length;
		this.interval = interval;
		this.speed = speed;
		this.creationDate = creationDate
		this.lastDeployDate = lastDeployDate;
	}

}