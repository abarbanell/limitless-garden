var expect = require('expect.js');
var sensor = require('../model/sensor.js');
var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var insertedIds = [];

describe('Sensor Model ', function() {
	beforeEach(function(done) {
		droprows(function(){
			insertrows(done);
		});
	});
	
	function insertrows(done){
		logger.info('insertrows: insert some data');
		var today = new Date();
		var objs = [{
			"soil": 35,
			"host": "rpi03",
			"sensor": "soil",
			"timestamp": Math.floor(Date.now() /1000)
		}, {
				"soil": 36,
				"host": "rpi02",
				"sensor": "soil",
				"timestamp": today.toISOString()
			}];
		db(function(err,dbObj){
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
		db(function(err,dbObj){
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
	
  it('should contain get and getMulti methods ', function(){
      expect(sensor).to.be.an('object');
      expect(sensor.get).to.be.an('function');
      expect(sensor.getMulti).to.be.an('function');	
  });

	it('get a single value - notfound', function(done) {
		sensor.get("notexistingid", function(err, result) { 
			// not found would return both err= null and result = null (or empty object{} )
			logger.info('get single - notfound - returns err=%s and result=%s', typeof(err), typeof(result));
			if (err) {
				logger.info('err = %s', JSON.stringify(err));
			}
			expect(err).to.not.be.ok(); 
			expect(result).to.not.be.ok();
		  done();
		});
	});
	
	it('get a single value - found', function (done) {
		sensor.get(insertedIds[0], function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				expect(result._id).to.eql(insertedIds[0]);
				done();
			}
		});
	});

	it('should get an array of values', function(done) {
		sensor.getMulti({}, {}, function (err, result) {
			logger.info('model_sensor test: getmulti callback reached');
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				logger.info('getMulti result: ' + JSON.stringify(result));
				expect(result.length).to.eql(insertedIds.length);
				done();
			}
		});
	});

	it('should get distinct hosts', function(done) {
		sensor.getUniqueHosts(function(err,result){
			if (err) {
				logger.err('sensor.js - error in distinctHosts()');
				return callback(err, null);
			};
			expect(err).to.not.be.ok();
			expect(result).to.be.ok();
			expect(result).to.be.an('array');
			expect(result.length).to.eql(2);
			done();
		});
	});
});
