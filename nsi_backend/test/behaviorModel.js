'use stricts'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const index = require('./../index');

chai.use(chaiHttp);
const url = 'http://localhost:4000/api/behaviormodels';

let behaviorModel = {
	name: 'TESTMODEL',
	fullModel: '{}',
	simulatorModel: '{}',
	modelWidth: 1000,
	modelHeight: 400,
	valid: true,
	creationDate: new Date(Date.now()).toString(),
	lastModificationDate: new Date(0).toString()
}

describe('Successfully add a behavior model, then get it, then update it, then delete it: ', () => {
	let behaviorModelId = 'NONE';
	it('should add a behavior model', (done) => {
		chai.request(url)
			.post('/create')
			.send(behaviorModel)
			.end(function(err, res) {
				behaviorModelId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(behaviorModel.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	let behaviorModelResponse = {};
	it('should get one behavior model', (done) => {
		chai.request(url)
			.get('/get/' + behaviorModelId)
			.end(function(err, res) {
				behaviorModelResponse = res.body;
				console.log(res.body)
				expect(res.body).to.have.property('_id').to.be.equal(behaviorModelId)
				expect(res).to.have.status(200);
				done();
			})
	});
	behaviorModelResponse.name = 'TESTMODEL2';
	it('should update a behavior model', (done) => {
		chai.request(url)
			.put('/update/' + behaviorModelId)
			.send(behaviorModelResponse)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('_id').to.be.equal(behaviorModelId)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should delete a behavior model', (done) => {
		chai.request(url)
			.delete('/delete/' + behaviorModelId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Behavior model deleted')
				expect(res).to.have.status(200);
				done();
			})
	});
});

describe('Unsuccessfully add a behavior model: ', () => {
	it('should fail to add a behavior model', (done) => {
		chai.request(url)
			.post('/create')
			.send({name: 'TESTMODEL'})
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			});
	});
});

describe('Unsuccessfully get one behavior model (method failed): ', () => {
	it('should fail to get one behavior model (method failed)', (done) => {
		chai.request(url)
			.get('/get/' + 'ERROR')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			});
	});
});

describe('Unsuccessfully get one behavior model (model does not exist): ', () => {
	it('should fail to get one behavior model (model does not exist)', (done) => {
		chai.request(url)
			.get('/get/' + '000000000000')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			});
	});
});

describe('Unsuccessfully update a behavior model (method failed): ', () => {
	it('should fail to update a behavior model (method failed)', (done) => {
		chai.request(url)
			.put('/update/' + 'ERROR')
			.send({name: 'TESTMODEL'})
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			})
	});
});

describe('Unsuccessfully update a behavior model (model does not exist): ', () => {
	it('should fail to update a behavior model (model does not exist)', (done) => {
		chai.request(url)
			.put('/update/' + '000000000000')
			.send({name: 'TESTMODEL'})
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	});
})

describe('Unsuccessfully delete a behavior model (method failed): ', () => {
	it('should fail to delete a behavior model (method failed)', (done) => {
		chai.request(url)
			.delete('/delete/' + 'ERROR')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			})
	});
});

describe('Unsuccessfully delete a behavior model (model does not exist): ', () => {
	it('should fail to delete a behavior model (model does not exist)', (done) => {
		chai.request(url)
			.delete('/delete/' + '000000000000')
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	});
});

describe('Successfully get all behavior models: ', () => {
	let behaviorModelId = 'NONE';
	it('should add a behavior model', (done) => {
		chai.request(url)
			.post('/create')
			.send(behaviorModel)
			.end(function(err, res) {
				behaviorModelId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(behaviorModel.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get all behavior models', (done) => {
		chai.request(url)
			.get('/get')
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body['0']).to.have.property('name', 'TESTMODEL')
				expect(res).to.have.status(200)
				done();
			});
	});
	it('should delete a behavior model', (done) => {
		chai.request(url)
			.delete('/delete/' + behaviorModelId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Behavior model deleted')
				expect(res).to.have.status(200)
				done();
			})
	});
});

describe('Successfully get all behavior models properties: ', () => {
	let behaviorModelId = 'NONE';
	it('should add a behavior model', (done) => {
		chai.request(url)
			.post('/create')
			.send(behaviorModel)
			.end(function(err, res) {
				behaviorModelId = res.body._id;
				console.log(res.body)
				expect(res.body).to.have.property('name').to.be.equal(behaviorModel.name)
				expect(res).to.have.status(200);
				done();
			})
	});
	it('should get all behavior models properties', (done) => {
		chai.request(url)
			.get('/getproperties')
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body['0']).to.have.property('name', 'TESTMODEL')
				expect(res).to.have.status(200)
				done();
			});
	});
	it('should delete a behavior model', (done) => {
		chai.request(url)
			.delete('/delete/' + behaviorModelId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body).to.have.property('msg').to.be.equal('Behavior model deleted')
				expect(res).to.have.status(200)
				done();
			})
	});
});