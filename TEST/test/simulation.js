'use stricts'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const index = require('./../index');

chai.use(chaiHttp);
const url = 'http://localhost:4000/api/simulations';

let creationDate = new Date(Date.now()).toString();

let simulation = {
	name: "TESTSIMULATION",
	description: "TESTDESCRIPTION",
	numberStudents: 1,
	numberDocuments: 1,
	numberRelevantDocuments: 1,
	randomActions: true,
	expiration: true,
	queryList: ['TESTQUERY1', 'TESTQUERY2'],
	behaviorModelId: '000000000000',
	length: 1,
	sensibility: 100,
	interval: 1000,
	speed: 1,
	creationDate: creationDate,
	lastDeployDate: new Date(0).toString(),
	lastModificationDate: creationDate
}

describe('Successfully add a simulation, then get it, then update it, then delete it: ', () => {
	let simulationId = 'NONE';
	it('should add a simulation', (done) => {
		chai.request(url)
			.post('/create')
			.send(simulation)
			.end(function(err, res) {
				simulationId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(simulation.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	let simulationResponse = {};
	it('should get one simulation', (done) => {
		chai.request(url)
			.get('/get/' + simulationId)
			.end(function(err, res) {
				simulationResponse = res.body;
				console.log(res.body)
				expect(res.body).to.have.property('_id').to.be.equal(simulationId)
				expect(res).to.have.status(200);
				done();
			})
	});
	simulationResponse.name = 'TESTSIMULATION2';
	it('should update a simulation', (done) => {
		chai.request(url)
			.put('/update/' + simulationId)
			.send(simulationResponse)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('_id').to.be.equal(simulationId)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should delete a simulation', (done) => {
		chai.request(url)
			.delete('/delete/' + simulationId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Simulation deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Unsuccessfully add a simulation: ', () => {
	it('should fail to add a simulation', (done) => {
		chai.request(url)
			.post('/create')
			.send({name: 'TESTSIMULATION'})
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			});
	});
});

describe('Unsuccessfully get one simulation (method failed): ', () => {
	it('should fail to get one simulation (method failed)', (done) => {
		chai.request(url)
			.get('/get/' + 'ERROR')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			});
	});
});

describe('Unsuccessfully get one simulation (simulation does not exist): ', () => {
	it('should fail to get one simulation (simulation does not exist)', (done) => {
		chai.request(url)
			.get('/get/' + '000000000000')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			});
	});
});

describe('Unsuccessfully update a simulation (method failed): ', () => {
	it('should fail to update a simulation (method failed)', (done) => {
		chai.request(url)
			.put('/update/' + 'ERROR')
			.send({name: 'TESTSIMULATION'})
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			})
	});
});

describe('Unsuccessfully update a simulation (simulation does not exist): ', () => {
	it('should fail to update a simulation (simulation does not exist)', (done) => {
		chai.request(url)
			.put('/update/' + '000000000000')
			.send({name: 'TESTSIMULATION'})
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	});
});

describe('Unsuccessfully delete a simulation (method failed): ', () => {
	it('should fail to delete a simulation (method failed)', (done) => {
		chai.request(url)
			.delete('/delete/' + 'ERROR')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			})
	});
});

describe('Unsuccessfully delete a simulation (simulation does not exist): ', () => {
	it('should fail to delete a simulation (simulation does not exist)', (done) => {
		chai.request(url)
			.delete('/delete/' + '000000000000')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	});
});

describe('Successfully get all simulations: ', () => {
	let simulationId = 'NONE';
	it('should add a simulation', (done) => {
		chai.request(url)
			.post('/create')
			.send(simulation)
			.end(function(err, res) {
				simulationId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(simulation.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get all simulations', (done) => {
		chai.request(url)
			.get('/get')
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body['0']).to.have.property('name', 'TESTSIMULATION')
				expect(res).to.have.status(200);
				done();
			});
	});
	it('should delete a simulation', (done) => {
		chai.request(url)
			.delete('/delete/' + simulationId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Simulation deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Successfully get the names of all simulations: ', () => {
	let simulationId = 'NONE';
	it('should add a simulation', (done) => {
		chai.request(url)
			.post('/create')
			.send(simulation)
			.end(function(err, res) {
				simulationId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(simulation.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get the names of all simulations', (done) => {
		chai.request(url)
			.get('/getnames')
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.be.an('array').that.includes('TESTSIMULATION')
				expect(res).to.have.status(200);
				done();
			});
	});
	it('should delete a simulation', (done) => {
		chai.request(url)
			.delete('/delete/' + simulationId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Simulation deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Successfully get all behavior models of all simulations: ', () => {
	let simulationId = 'NONE';
	it('should add a simulation', (done) => {
		chai.request(url)
			.post('/create')
			.send(simulation)
			.end(function(err, res) {
				simulationId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(simulation.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get all behavior models of all simulations', (done) => {
		chai.request(url)
			.get('/getmodels')
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body['0']).to.have.property('simulationName', 'TESTSIMULATION')
				expect(res).to.have.status(200);
				done();
			});
	});
	it('should delete a simulation', (done) => {
		chai.request(url)
			.delete('/delete/' + simulationId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Simulation deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Unsuccessfully update a simulation last deploy date (method failed): ', () => {
	it('should fail to update the last deploy date of a simulation (method failed)', (done) => {
		chai.request(url)
			.put('/updatelastdeploydate/' + 'ERROR')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			})
	});
});

describe('Unsuccessfully update a simulation last deploy date (simulation does not exist): ', () => {
	it('should fail to update the last deploy date of a simulation (simulation does not exist)', (done) => {
		chai.request(url)
			.put('/updatelastdeploydate/' + '000000000000')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	});
});


