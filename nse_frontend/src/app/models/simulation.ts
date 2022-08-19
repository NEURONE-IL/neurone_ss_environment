// Defines the data model for a simulation
export class Simulation {

	_id?: string;						// ID
	name: string;						// Name of the simulation
	description: string;				// A description of the simulation
	numberStudents: number;				// Number of students in the simulation
	numberDocuments: number;			// Number of documents that the students can explore
	numberRelevantDocuments: number;	// Number of relevant documents
	randomActions: boolean;				// Whether the simulation will use the behavior model or not
	expiration: boolean;				// Unused option
	queryList: string[];				// List of queries for the simulation
	behaviorModelId: string;			// ID of the behavior model of the simulation
	length: number;						// Running time of the simulation
	sensibility: number;				// Probability of a student performing an action at a specific moment in time
	interval: number;					// Time that must be elapsed between student actions
	speed: number;						// Number that the interval is divided by
	creationDate: string;				// Date of creation
	lastDeployDate: string;				// Date of last deploy
	lastModificationDate: string;		// Date of last modification

	constructor(_id: string,
				name: string,
				description: string,
				numberStudents: number,
				numberDocuments: number,
				numberRelevantDocuments: number,
				randomActions: boolean,
				expiration: boolean,
				queryList: string[],
				behaviorModelId: string,
				length: number,
				sensibility: number,
				interval: number,
				speed: number,
				creationDate: string,
				lastDeployDate: string,
				lastModificationDate: string) {
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