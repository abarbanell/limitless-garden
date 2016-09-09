var expect = require('expect.js');
var util = require('util');
var sensor = require('../model/sensor.js');
var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var sensorHelper = require('./helper/sensor.js');

describe('Sensor Model ', function() {
	beforeEach(function(done) {
		sensorHelper.droprows(function(){
			sensorHelper.insertrows(done);
		});
	});
	
	after(function(done){
		sensorHelper.droprows(done);
	});	
	
  it('should contain get and getMulti methods ', function(){
      expect(sensor).to.be.an('object');
      expect(sensor.get).to.be.an('function');
      expect(sensor.getMulti).to.be.an('function');	
  });

  it('should insert 3 rows in beforeEach ', function(){
      expect(sensorHelper.insertedIds).to.be.an('function');
      expect(sensorHelper.insertedIds()).to.be.an('array');
      expect(sensorHelper.insertedIds().length).to.be.eql(3);
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
		sensor.get(sensorHelper.insertedIds()[0], function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				expect(result._id).to.eql(sensorHelper.insertedIds()[0]);
				done();
			}
		});
	});
		
	it('get a single value - broken sensor field', function (done) {
		sensor.get(sensorHelper.insertedIds()[2], function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				expect(result._id).to.eql(sensorHelper.insertedIds()[2]);
				logger.info('model_sensor test with broken sensor field: '+ util.inspect(util.sensor));
				expect(result.sensor).to.be.an('array'); // broken sensor value should be converted to empty array
				expect(result.sensor.length).to.eql(0); 
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
				expect(result.length).to.eql(sensorHelper.insertedIds().length);
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
			expect(result.length).to.eql(3);
			done();
		});
	});
});
