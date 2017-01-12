// API integration tests

// prerequisites
var sensor = require('../../model/sensor.js');
var supertest = require('supertest');
var status = require('http-status');
var util = require('util');
var logger = require('../../util/logger');
// var db = require('../../util/db');
// var env = process.env.ENVIRONMENT || 'dev';
// var colname = env + '.sensor';
// var insertedIds = [];

// environment
var port = process.env.TEST_PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../../bin/www');

describe('sensor API tests', function() {
	beforeEach(function(done) {
		// droprows(function(){
		// 	insertrows(done);
		// });
	});

	function insertrows(done){
		logger.info('insertrows: insert some data via ensor model');
		// var today = new Date();
		// var objs = [];
		// for (var i=0; i<20; i++) {
		// 	var m1 = {
		// 	"soil": 35 +i ,
		// 	"host": "rpi03",
		// 	"sensor": "soil",
		// 	"timestamp": Math.floor(Date.now() /1000)
		// 	};
		// 	var m2 =  {
		// 		"soil": 36 - i,
		// 		"host": "rpi02",
		// 		"sensor": "soil",
		// 		"timestamp": today.toISOString()
		// 	};
		// 	objs.push(m1);
		// 	objs.push(m2);
		// }
		// db.connect(function(err,dbObj){
		// 	dbObj.collection(colname).insert(objs, function(err, result) {
		// 		if (err) {
		// 			logger.error('insertrows Error: ' + err);
		// 			done();
		// 		} 
		// 		logger.info('insertrows result: ' + JSON.stringify(result));
		// 		insertedIds = result.insertedIds;
		// 		dbObj.close();
		// 		done();
		// 	});
		// });
	};
	
	afterAll(function(done){
		droprows(done);
	});	
	
	function droprows(done) {
		// drop rows via sensor model
		// db.connect(function(err,dbObj){
		// 	dbObj.collection(colname).remove({}, function(err, result) {
		// 		if (err) {
		// 			logger.error('droprows() error: '+ err);
		// 		}
		// 		logger.info('droprows() - removed data: ' + JSON.stringify(result));
		// 		dbObj.close();
		// 		done();
		// 	});
		// });
	};
	
	// Update sensor API to 
	// GET /api/sensors -> list of sensors
	// GET /api/sensors/:sensorid -> details about one sensor (host, name, type,...)
	// GET /api/sensors/:sensorid/data -> list of data points 
	// GET /api/sensors/:sensorid/data/:dataid -> one data point 
	// POST /api/sensors -> create new sensor 
	// POST /api/sensor/:sensorid/data -> create new data element under sensor
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



