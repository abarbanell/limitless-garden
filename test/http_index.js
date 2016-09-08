// API integration tests

// prerequisites
var expect = require('expect.js');
var supertest = require('supertest');
var status = require('http-status');
var util = require('util');
var logger = require('../util/logger');
var httpMocks = require('node-mocks-http');
var rewire = require('rewire');
var sensorHelper = require('./helper/sensor.js');

// environment
var port = process.env.PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../bin/www');
var indexrouter = rewire('../routes/index.js');

describe('collections index.js route supertests', function() {

	it('GET about page - no auth needed', function(done) {
		supertest(server)
		.get('/about')
		.expect(status.OK, done);
	});

	it('GET login page - even if no auth ', function(done) {
		supertest(server)
		.get('/login')
		.expect(status.OK, done);
	});

	it('GET logout page - successful redirect even if no auth ', function(done) {
		supertest(server)
		.get('/logout')
		.expect(status.FOUND, done);
	});

});

describe('Middleware test for for index routes', function() {
	var request, response; 

	beforeEach(function(done) {
		request = httpMocks.createRequest({
			rethod: 'GET',
			url: '/api/sensor',
			isAuthenticated: function(){ return true;}
		});
		response = httpMocks.createResponse();
		sensorHelper.droprows(function() {
			sensorHelper.insertrows(done);
		});
	});

	after(function(done) {
		sensorHelper.droprows(done);
	});

	it('check sensorRoute - happy path', function(done) {
		// we want to catch the res.render function
		response.render = function(view, obj) { 
			expect(view).to.be.ok();
			expect(obj).to.be.ok();
			done();
		};
		var sr = indexrouter.__get__('sensorRoute');
		sr(request, response, function next(error) {
			if (error) {
				logger.error("error received");
			};
			expect("you should not get here").to.eql("true");
			done();
		});
	});

	it('collectionsListRoute - happy path', function(done) {
		// we want to catch the res.render function
		response.render = function(view, obj) { 
			expect(view).to.be.eql('index');
			expect(obj).to.be.ok();
			done();
		};
		var sr = indexrouter.__get__('collectionsListRoute');
		sr(request, response, function next(error) {
			if (error) {
				logger.error("error received");
			};
			expect("you should not get here").to.eql("true");
			done();
		});
	});

	it('collectionsRoute - happy path', function(done) {
		// we need to add a db collection obj to the request object
		sensorHelper.getCollection(function(collection) {
			request.collection = collection;
			// we want to catch the res.render function
			response.render = function(view, obj) { 
				expect(view).to.be.eql('collection');
				expect(obj).to.be.ok();
				done();
			};
			var sr = indexrouter.__get__('collectionsRoute');
			sr(request, response, function next(error) {
				if (error) {
					logger.error("error received");
				};
				expect("you should not get here").to.eql("true");
				done();
			});
		});
	});
		
	it('hostsRoute - happy path', function(done) {
		// we need to add a db collection obj to the request object
		sensorHelper.getCollection(function(collection) {
			// we want to catch the res.render function
			response.render = function(view, obj) { 
				expect(view).to.be.eql('hosts');
				expect(obj).to.be.ok();
				expect(obj.title).to.be.an('string');
				expect(obj.data).to.be.an('array');
				done();
			};
			var sr = indexrouter.__get__('hostsRoute');
			sr(request, response, function next(error) {
				if (error) {
					logger.error("error received");
				};
				expect("you should not get here").to.eql("true");
				done();
			});
		});
	});
		
	it('hostDataRoute - happy path single sensor', function(done) {
		// we need to add a db collection obj to the request object
		sensorHelper.getCollection(function(collection) {
			expect(request.params).to.be.ok();
			request.params.host = "rpi02";
			// we want to catch the res.render function
			response.render = function(view, obj) { 
				expect(view).to.be.eql('hostdata');
				expect(obj).to.be.ok();
				expect(obj.title).to.be.an('string');
				expect(obj.data).to.be.an('array');
				expect(obj.data[0].sensor).to.be.an('array');
				expect(obj.data[0].sensor.length).to.eql(1);
				done();
			};
			var sr = indexrouter.__get__('hostDataRoute');
			sr(request, response, function next(error) {
				if (error) {
					logger.error("error received");
				};
				expect("you should not get here").to.eql("true");
				done();
			});
		});
	});
		
	it('hostDataRoute - happy path multi sensor', function(done) {
		// we need to add a db collection obj to the request object
		sensorHelper.getCollection(function(collection) {
			expect(request.params).to.be.ok();
			request.params.host = "rpi03";
			// we want to catch the res.render function
			response.render = function(view, obj) { 
				expect(view).to.be.eql('hostdata');
				expect(obj).to.be.ok();
				expect(obj.title).to.be.an('string');
				expect(obj.data).to.be.an('array');
				expect(obj.data[0].sensor).to.be.an('array');
				expect(obj.data[0].sensor[0]).to.be.an('string');
				logger.info('sensor.length: ' + obj.data[0].sensor.length);
				expect(obj.data[0].sensor.length).to.be.greaterThan(1);
				done();
			};
			var sr = indexrouter.__get__('hostDataRoute');
			sr(request, response, function next(error) {
				if (error) {
					logger.error("error received");
				};
				expect("you should not get here").to.eql("true");
				done();
			});
		});
	});
		
});		
	



