// Sesnor API integration tests

// prerequisites

var supertest = require('supertest');
var httpStatus = require('http-status');
var util = require('util');
import logger = require('../../src/util/logger');
import { SensorModel } from '../../src/model/sensor.model';
import { Observable } from 'rxjs/Rx';

// environment
var port = process.env.TEST_PORT || "4321";
process.env.PORT = port;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../../src/server');

describe('sensor API tests', function() {
	beforeEach(done => {
		var s = new SensorModel();
		s.deleteAll().subscribe(s => { 
			logger.info('beforeAll: deleted row count is ', s);
			done(); 
		});
	})
  it('server should be valid', function(done){
      expect(server).toBeTruthy();
			expect(server.listen).toBeDefined();
			done();
  });
	
	it('port should be set', function(done) {
		expect(port).toBeTruthy();
		logger.info('port=%s', port);
		done();
	});

	it('user_key should be set', function(done) {
		expect(user_key).toBeTruthy();
		logger.info('user_key=%s', user_key);
		done();
	});

	it('GET sensors,  missing user_key should return BAD_REQUEST', function(done) {
		supertest(server)
		.get('/api/sensors')
		.expect(httpStatus.BAD_REQUEST, done);
	});

	// GET /api/sensors -> list of sensors
	it('GET sensors, returns empty Array', function(done) {
		supertest(server)
		.get('/api/sensors?user_key=true')
		.expect(httpStatus.OK)
		.end(function(err, res) {
			logger.info('res.body (expected empty): ', res.body);
			expect(res.body.length).toBeDefined();
			expect(res.body.length).toBe(0);
			done();
		});
	});

	// POST /api/sensors -> create new sensor 
	it('POST sensors, returns OK', function(done) {
		var input = { 
			name: "new sensor 17",
			host: "rpi02",
			type: {
				name: "soil"
			}
		};
		supertest(server)
		.post('/api/sensors?user_key=true')
		.send(input)
		.expect(httpStatus.OK)
		.end(function(err, res) {
			logger.info('res.body: ', res.body);
			expect(res.body._id).toBeDefined();
			expect(res.body.rc).toBeDefined();
			done();
		});
	});

it('POST and GET again, returns Object', function(done) {
		var input = { 
			name: "new sensor 17",
			host: "rpi02",
			type: {
				name: "soil"
			}
		};
		supertest(server)
		.post('/api/sensors?user_key=true')
		.send(input)
		.expect(httpStatus.OK)
		.end(function(err, res) {
			logger.error('res.body: ', res.body);
			expect(res.body._id).toBeDefined();
			expect(res.body.rc).toBeDefined();
			var id = res.body._id;
			var getUrl = '/api/sensors/' + id + '?user_key=true';
			supertest(server)
				.get(getUrl)
				.end((err, res) => {
					logger.info('get after post: status: ', res.status);
					expect(res.status).toBe(httpStatus.OK);
					expect(res.body).toBeDefined();
					expect(res.body._id).toBeDefined();
					expect(res.body._id).toBe(id);
					done();
				});
		});
	});

// DELETE /api/sensor/:sensorid/data 
	it('POST and DELETE, returns Object', function(done) {
		var input = { 
			name: "new sensor 17",
			host: "rpi02",
			type: {
				name: "soil"
			}
		};
		supertest(server)
		.post('/api/sensors?user_key=true')
		.send(input)
		.expect(httpStatus.OK)
		.end(function(err, res) {
			logger.error('res.body: ', res.body);
			expect(res.body._id).toBeDefined();
			expect(res.body.rc).toBeDefined();
			var id = res.body._id;
			var getUrl = '/api/sensors/' + id + '?user_key=true';
			supertest(server)
				.del(getUrl)
				.end((err, res) => {
					logger.info('del after post: status: ', res.status);
					expect(res.status).toBe(httpStatus.OK);
					expect(res.body.rc).toEqual('OK');
					expect(res.body.deletedCount).toEqual(1);
					done();
				});
		});
	});

	// Update sensor API to 

	// GET /api/sensors/:sensorid -> details about one sensor (host, name, type,...)
	// GET /api/sensors/:sensorid/data -> list of data points 
	// GET /api/sensors/:sensorid/data/:dataid -> one data point 
	
	
	// DELETE /api/sensor/:sensorid -> delet a sensor, il all data rows are deleted
	// DELETE /api/sensor:sensorid/data/:dataid -> delete one data row

	// Later: PUT or Patch for update operations.

	// OLD sensor API - remove
	// it('GET sensor/host/soil', function(done) {
	// 	var url = '/api/sensor/rpi02/soil?user_key=' + user_key;
	// 	supertest(server)
	// 	.get(url)
	// 	.expect(status.OK)
	// 	.end(function(err,res) {
	// 		expect(err).not.toBeTruthy();
	// 		expect(res).toBeTruthy();
	// 		logger.info('res = %s', util.inspect(res.body));
	// 		expect(res.body[0].soil).toEqual(36);
	// 		expect(res.body.length).toEqual(20);
	// 		done();
	// 	});
	// });

	// it('GET sensor/host/soil with limit', function(done) {
	// 	var url = '/api/sensor/rpi02/soil?user_key=' + user_key + '&limit=5';
	// 	supertest(server)
	// 	.get(url)
	// 	.expect(status.OK)
	// 	.end(function(err,res) {
	// 		expect(err).not.toBeTruthy();
	// 		expect(res).toBeTruthy();
	// 		logger.info('res = %s', util.inspect(res.body));
	// 		expect(res.body[0].soil).toEqual(36);
	// 		expect(res.body.length).toEqual(5);
	// 		done();
	// 	});
	// });

});



