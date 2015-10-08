var expect = require('expect.js');
var sensor = require('../model/sensor.js');
var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var insertedIds = [];

describe('Sensor Model ', function() {
	beforeEach(function(done) {
		logger.info('beforeEach: remove and insert some data');
		var objs = [{
			"soil": 35,
			"host": "rpi03",
			"sensor": "soil",
			"timestamp": "2015-09-29T19:23:12.435121"
		}, {
				"soil": 36,
				"host": "rpi03",
				"sensor": "soil",
				"timestamp": "2015-09-29T19:28:12.435121"
			}];
		db.collection(colname).insert(objs, function(err, result) {
			if (err) {
				logger.error('beforeEach Error: ' + err);
				done();
			} 
			logger.info('beforeEach result: ' + JSON.stringify(result));
			insertedIds = result.insertedIds;
			done();
		});
	});
	
	after(function(done){
		db.collection(colname).remove({}, function(err, result) {
			if (err) {
				logger.error('after() error: '+ err);
			}
			logger.info('after() - removed data: ' + JSON.stringify(result));
			done();
		});
	});
  it('should contain get and getMulti methods ', function(){
      expect(sensor).to.be.an('object');
      expect(sensor.get).to.be.an('function');
      expect(sensor.getMulti).to.be.an('function');	
  });

	it('get a single value - notfound', function(done) {
		sensor.get("notexistingid", function(err, result) { 
			if (err) logger.info('err = ' + JSON.stringify(err));
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
		done();
	});
});
