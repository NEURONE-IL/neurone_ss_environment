'use stricts'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const index = require('./../index');

chai.use(chaiHttp);
const url = 'http://localhost:4000/api';

let behaviorModel = {
	name: 'TESTMODEL',
	fullModel: '{"cells":[{"type":"standard.BorderedImage","position":{"x":100,"y":30},"size":{"width":150,"height":65},"angle":0,"ports":{"groups":{"rightPorts":{"position":"right","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]}},"items":[{"group":"rightPorts","attrs":{"label":{"text":"rightPort1"}},"id":"b60fbd10-89ff-4d34-9933-52e071a37b6e"}]},"id":"67eeb639-06c3-46f1-bbe9-6c62b43d4231","typeNode":"start","z":1,"attrs":{"border":{"stroke":"black","rx":5,"ry":5},"background":{"fill":"turquoise"},"image":{"refWidth":0.7,"refHeight":0.7,"xlink:href":"/assets/behavior-model-start.png","refX":0.15,"refY":0.15},"label":{"text":"Start"},"root":{"magnet":false}}},{"type":"standard.BorderedImage","position":{"x":390,"y":30},"size":{"width":150,"height":65},"angle":0,"ports":{"groups":{"leftPorts":{"position":"left","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]},"rightPorts":{"position":"right","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]}},"items":[{"group":"leftPorts","attrs":{"label":{"text":"leftPort1"}},"id":"290b6135-ac29-4c5f-ad76-fa15e390a5a4"},{"group":"leftPorts","attrs":{"label":{"text":"leftPort2"}},"id":"67b888e8-3723-4bf4-a979-0c26248396c1"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort1"}},"id":"03672395-3faf-4147-ac75-53662fc52354"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort2"}},"id":"ad8d9850-f8a4-4b70-8a26-07e0d3465aa7"}]},"id":"6912dbff-46e8-40a8-89cf-0ffdf0e0da03","typeNode":"query","minTransitionTime":-1,"maxTransitionTime":-1,"z":2,"attrs":{"border":{"stroke":"black","rx":5,"ry":5},"background":{"fill":"#b071eb"},"image":{"refWidth":0.7,"refHeight":0.7,"xlink:href":"/assets/behavior-model-query.png","refX":0.15,"refY":0.15},"label":{"text":"(new query 1)"},"root":{"magnet":false}}},{"type":"standard.BorderedImage","position":{"x":470,"y":210},"size":{"width":65,"height":65},"angle":0,"ports":{"groups":{"leftPorts":{"position":"left","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]},"rightPorts":{"position":"right","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]}},"items":[{"group":"leftPorts","attrs":{"label":{"text":"leftPort1"}},"id":"358e1077-95c0-4a69-9176-d8c07a8f2fdc"},{"group":"leftPorts","attrs":{"label":{"text":"leftPort2"}},"id":"906f4fec-731e-43a4-b8f2-79c4c2e54f82"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort1"}},"id":"cd481c38-4b45-4936-8731-b90cb7109382"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort2"}},"id":"792e9035-1f63-4469-8308-94491cc3f1f3"}]},"id":"ad2a70a8-5a65-461b-85e8-3b67f90ca59c","typeNode":"bookmark","minTransitionTime":-1,"maxTransitionTime":-1,"z":3,"attrs":{"border":{"stroke":"black","rx":5,"ry":5},"background":{"fill":"#96bed4"},"image":{"refWidth":0.7,"refHeight":0.7,"xlink:href":"/assets/behavior-model-bookmark.png","refX":0.15,"refY":0.15},"label":{"text":"(new bookmark 1)"},"root":{"magnet":false}}},{"type":"standard.BorderedImage","position":{"x":720,"y":200},"size":{"width":150,"height":65},"angle":0,"ports":{"groups":{"leftPorts":{"position":"left","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]},"rightPorts":{"position":"right","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]}},"items":[{"group":"leftPorts","attrs":{"label":{"text":"leftPort1"}},"id":"6b68e19c-fc94-4f62-a918-4301d7359c8e"},{"group":"leftPorts","attrs":{"label":{"text":"leftPort2"}},"id":"ca1dbaa0-a2fe-4c75-bb62-4445c0e792e2"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort1"}},"id":"963d4f5c-81fb-4454-8d5f-e2563c7c8ccc"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort2"}},"id":"e3cf04b9-db8f-4e85-bcd5-bf285ca2b15e"}]},"id":"4c6c44dc-4a15-4c40-b2bc-0ca2fe5df360","typeNode":"end","z":4,"attrs":{"border":{"stroke":"black","rx":5,"ry":5},"background":{"fill":"yellow"},"image":{"refWidth":0.7,"refHeight":0.7,"xlink:href":"/assets/behavior-model-end.png","refX":0.15,"refY":0.15},"label":{"text":"(new end 1)"},"root":{"magnet":false}}},{"type":"link","source":{"id":"67eeb639-06c3-46f1-bbe9-6c62b43d4231","magnet":"portBody","port":"b60fbd10-89ff-4d34-9933-52e071a37b6e"},"target":{"id":"6912dbff-46e8-40a8-89cf-0ffdf0e0da03","magnet":"portBody","port":"290b6135-ac29-4c5f-ad76-fa15e390a5a4"},"router":{"name":"manhattan"},"connection":{"name":"rounded"},"connector":{"name":"jumpover"},"labels":[{"position":0.5,"attrs":{"text":{"text":"100%","fill":"black"}}}],"id":"f750662a-c60c-47a0-a6c5-daaef8be6b9b","z":5,"attrs":{".connection":{"stroke-width":2},".marker-target":{"d":"M 10 0 L 0 5 L 10 10 z","fill":"blue","stroke":"blue"},"text":{"fill":"black"}}},{"type":"standard.BorderedImage","position":{"x":750,"y":60},"size":{"width":150,"height":65},"angle":0,"ports":{"groups":{"leftPorts":{"position":"left","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]},"rightPorts":{"position":"right","label":{"position":"outside"},"attrs":{"portBody":{"r":8,"fill":"green","stroke":"black","magnet":true}},"markup":[{"tagName":"circle","selector":"portBody"}]}},"items":[{"group":"leftPorts","attrs":{"label":{"text":"leftPort1"}},"id":"daeaba93-c7bd-495f-a807-c9f9e8be0a8d"},{"group":"leftPorts","attrs":{"label":{"text":"leftPort2"}},"id":"cd68ee74-0a39-4c16-8cf2-1bdb351049cc"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort1"}},"id":"fc3abc2d-beb6-427a-a1b1-e35c280804a0"},{"group":"rightPorts","attrs":{"label":{"text":"rightPort2"}},"id":"35446eb0-988a-4f98-b7b6-fe13da8c3e8e"}]},"id":"5f125493-d2d9-499f-8772-fdd8d3066b21","typeNode":"page","minTransitionTime":-1,"maxTransitionTime":-1,"relevantPage":false,"z":6,"attrs":{"border":{"stroke":"black","rx":5,"ry":5},"background":{"fill":"lightgrey"},"image":{"refWidth":0.7,"refHeight":0.7,"xlink:href":"/assets/behavior-model-page.png","refX":0.15,"refY":0.15},"label":{"text":"(new page 1)"},"root":{"magnet":false}}},{"type":"link","source":{"id":"6912dbff-46e8-40a8-89cf-0ffdf0e0da03","magnet":"portBody","port":"03672395-3faf-4147-ac75-53662fc52354"},"target":{"id":"5f125493-d2d9-499f-8772-fdd8d3066b21","magnet":"portBody","port":"daeaba93-c7bd-495f-a807-c9f9e8be0a8d"},"router":{"name":"manhattan"},"connection":{"name":"rounded"},"connector":{"name":"jumpover"},"labels":[{"position":0.5,"attrs":{"text":{"text":"100%","fill":"black"}}}],"id":"67a24279-f3cd-47de-8f3c-63a131099648","z":7,"attrs":{".connection":{"stroke-width":2},".marker-target":{"d":"M 10 0 L 0 5 L 10 10 z","fill":"blue","stroke":"blue"},"text":{"fill":"black"}}},{"type":"link","source":{"id":"5f125493-d2d9-499f-8772-fdd8d3066b21","magnet":"portBody","port":"cd68ee74-0a39-4c16-8cf2-1bdb351049cc"},"target":{"id":"ad2a70a8-5a65-461b-85e8-3b67f90ca59c","magnet":"portBody","port":"cd481c38-4b45-4936-8731-b90cb7109382"},"router":{"name":"manhattan"},"connection":{"name":"rounded"},"connector":{"name":"jumpover"},"labels":[{"position":{"distance":0.32278481012658233,"angle":0},"attrs":{"text":{"text":"100%","fill":"black"}}}],"id":"cb62ac15-c5cf-49c2-8e7a-62db1e37d655","z":8,"attrs":{".connection":{"stroke-width":2},".marker-target":{"d":"M 10 0 L 0 5 L 10 10 z","fill":"blue","stroke":"blue"},"text":{"fill":"black"}}},{"type":"link","source":{"id":"ad2a70a8-5a65-461b-85e8-3b67f90ca59c","magnet":"portBody","port":"792e9035-1f63-4469-8308-94491cc3f1f3"},"target":{"id":"4c6c44dc-4a15-4c40-b2bc-0ca2fe5df360","magnet":"portBody","port":"ca1dbaa0-a2fe-4c75-bb62-4445c0e792e2"},"router":{"name":"manhattan"},"connection":{"name":"rounded"},"connector":{"name":"jumpover"},"labels":[{"position":0.5,"attrs":{"text":{"text":"100%","fill":"black"}}}],"id":"e6dae9fa-9958-4ddf-bbe9-5946f5560c95","z":9,"attrs":{".connection":{"stroke-width":2},".marker-target":{"d":"M 10 0 L 0 5 L 10 10 z","fill":"blue","stroke":"blue"},"text":{"fill":"black"}}}]}',
	simulatorModel: '{"Q1":{"T":0,"P1":1},"Q1P1":{"B":1,"T":0},"Q1P1B":{"T":1}}',
	modelWidth: 1000,
	modelHeight: 400,
	valid: true,
	creationDate: new Date(Date.now()).toString(),
	lastModificationDate: new Date(0).toString()
};

let creationDate = new Date(Date.now()).toString();

let simulation = {
	name: "TESTSIMULATION",
	description: "TESTDESCRIPTION",
	numberStudents: 1,
	numberDocuments: 10,
	numberRelevantDocuments: 5,
	randomActions: false,
	expiration: true,
	queryList: ['TESTQUERY1', 'TESTQUERY2'],
	behaviorModelId: 'NONE',
	length: 1,
	sensibility: 90,
	interval: 100,
	speed: 1,
	creationDate: creationDate,
	lastDeployDate: new Date(0).toString(),
	lastModificationDate: creationDate
};

describe('Successfully deploy a simulation and read the generated data (bookmarks, keystrokes, queries, visitedLinks): ', () => {
	it('should add a behavior model', (done) => {
		chai.request(url)
			.post('/behaviormodels/create')
			.send(behaviorModel)
			.end(function(err, res) {
				simulation.behaviorModelId = res.body._id;
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	});
	let simulationId = 'NONE';
	it('should add a simulation', (done) => {
		chai.request(url)
			.post('/simulations/create')
			.send(simulation)
			.end(function(err, res) {
				simulationId = res.body._id;
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should deploy a simulation', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/start/' + simulationId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.be.equal('"ok"')
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should stop a simulation', async function() {
		await new Promise(resolve => setTimeout(() => { resolve(); }, 10000));
		chai.request(url)
			.get('/simulationdata/deploy/stop/')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
			})
	});
	it('should get bookmarks', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getbookmarks')
			.end(function(err, res) {
				console.log(res.body)
				//expect(res.body).to.have.property('_id').to.be.equal(simulationId)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get keystrokes', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getkeystrokes')
			.end(function(err, res) {
				console.log(res.body)
				//expect(res.body).to.have.property('_id').to.be.equal(simulationId)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get queries', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getqueries')
			.end(function(err, res) {
				console.log(res.body)
				//expect(res.body).to.have.property('_id').to.be.equal(simulationId)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get visited links', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getvisitedlinks')
			.end(function(err, res) {
				console.log(res.body)
				//expect(res.body).to.have.property('_id').to.be.equal(simulationId)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should delete a behavior model', (done) => {
		chai.request(url)
			.delete('/behaviormodels/delete/' + simulation.behaviorModelId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Behavior model deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should delete a simulation', (done) => {
		chai.request(url)
			.delete('/simulations/delete/' + simulationId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Simulation deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Unsuccessfully deploy a simulation (simulation does not exist): ', () => {
	it('should fail to deploy a simulation (simulation does not exist)', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/start/' + '000000000000')
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal("Error: simulation doesn't exist")
				expect(res).to.have.status(404);
				done();
			})
	});
});

describe('Successfully read the latest bookmarks generated through a simulation: ', () => {
	it('should read the latest bookmarks generated through a simulation', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getlatestbookmarks/' + '0')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Successfully read the latest keystrokes generated through a simulation: ', () => {
	it('should read the latest keystrokes generated through a simulation', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getlatestkeystrokes/' + '0')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Successfully read the latest queries generated through a simulation: ', () => {
	it('should read the latest queries generated through a simulation', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getlatestqueries/' + '0')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Successfully read the latest visitedLinks generated through a simulation: ', () => {
	it('should read the latest visitedLinks generated through a simulation', (done) => {
		chai.request(url)
			.get('/simulationdata/deploy/getlatestvisitedlinks/' + '0')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	});
});