// API integration tests

// prerequisites
var expect = require('expect.js');
var sensor = require('../model/sensor.js');
var supertest = require('supertest');
var status = require('http-status');
var util = require('util');
var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var insertedIds = [];

// environment
var port = process.env.PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../bin/www');

describe('sensor API tests', function() {
	beforeEach(function(done) {
		droprows(function(){
			insertrows(done);
		});
	});

	function insertrows(done){
		logger.info('insertrows: insert some data');
		var today = new Date();
		var objs = [];
		for (var i=0; i<20; i++) {
			var m1 = {
			"soil": 35 +i ,
			"host": "rpi03",
			"sensor": "soil",
			"timestamp": Math.floor(Date.now() /1000)
			};
			var m2 =  {
				"soil": 36 - i,
				"host": "rpi02",
				"sensor": "soil",
				"timestamp": today.toISOString()
			};
			objs.push(m1);
			objs.push(m2);
		}
		db.connect(function(err,dbObj){
			dbObj.collection(colname).insert(objs, function(err, result) {
				if (err) {
					logger.error('insertrows Error: ' + err);
					done();
				} 
				logger.info('insertrows result: ' + JSON.stringify(result));
				insertedIds = result.insertedIds;
				dbObj.close();
				done();
			});
		});
	};
	
	after(function(done){
		droprows(done);
	});	
	
	function droprows(done) {
		db.connect(function(err,dbObj){
			dbObj.collection(colname).remove({}, function(err, result) {
				if (err) {
					logger.error('droprows() error: '+ err);
				}
				logger.info('droprows() - removed data: ' + JSON.stringify(result));
				dbObj.close();
				done();
			});
		});
	};
	
	
	it('GET sensor/host/soil', function(done) {
		var url = '/api/sensor/rpi02/soil?user_key=' + user_key;
		supertest(server)
		.get(url)
		.expect(status.OK)
		.end(function(err,res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			logger.info('res = %s', util.inspect(res.body));
			expect(res.body[0].soil).to.eql(36);
			expect(res.body.length).to.eql(20);
			done();
		});
	});

	it('GET sensor/host/soil with limit', function(done) {
		var url = '/api/sensor/rpi02/soil?user_key=' + user_key + '&limit=5';
		supertest(server)
		.get(url)
		.expect(status.OK)
		.end(function(err,res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			logger.info('res = %s', util.inspect(res.body));
			expect(res.body[0].soil).to.eql(36);
			expect(res.body.length).to.eql(5);
			done();
		});
	});

});



