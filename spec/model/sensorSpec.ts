var util = require('util');
var sensor = require('../../src/model/sensor');
var logger = require('../../src/util/logger');
var sensorHelper = require('../helpers/sensor');


describe('Sensor Model V0', function() {
	beforeEach(function(done) {
		sensorHelper.droprows(function(){
			sensorHelper.insertrows(done);
		});
	});
	
	afterAll(function(done){
		sensorHelper.droprows(done);
	});	
	
  it('should contain get and getMulti methods ', function(){
      expect(typeof(sensor)).toBe('object');
      expect(typeof(sensor.get)).toBe('function');
      expect(typeof(sensor.getMulti)).toBe('function');	
  });

  it('should insert 3 rows in beforeEach ', function(){
      expect(typeof(sensorHelper.insertedIds)).toBe('function');
      expect(typeof(sensorHelper.insertedIds().length)).toBe('number');
      expect(sensorHelper.insertedIds().length).toEqual(3);
  });

	it('get a single value - notfound', function(done) {
		sensor.get("notexistingid", function(err, result) { 
			// not found would return both err= null and result = null (or empty object{} )
			expect(err).not.toBeTruthy(); 
			expect(result).not.toBeTruthy();
		  done();
		});
	});
	
	it('get a single value - found', function (done) {
		sensor.get(sensorHelper.insertedIds()[0], function (err, result) {
				expect(err).not.toBeTruthy();
				expect(result).toBeTruthy();
				expect(result._id).toEqual(sensorHelper.insertedIds()[0]);
				done();
		});
	});
		
	it('get a single value - broken sensor field', function (done) {
		spyOn(logger, 'error');
		sensor.get(sensorHelper.insertedIds()[2], function (err, result) {
			expect(logger.error).toHaveBeenCalled();
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).not.toBeTruthy();
				expect(result).toBeTruthy();
				expect(result._id).toEqual(sensorHelper.insertedIds()[2]);
				logger.info('model_sensor test with broken sensor field: '+ util.inspect(util.sensor));
				expect(typeof(result.sensor.length)).toBe('number'); // broken sensor value should be converted to empty array
				expect(result.sensor.length).toEqual(0); 
				done();
			}
		});
	});

	it('should get an array of values', function(done) {
		spyOn(logger, 'error');
		sensor.getMulti({}, {}, function (err, result) {
			expect(logger.error).toHaveBeenCalled();
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).not.toBeTruthy();
				expect(result).toBeTruthy();
				expect(result.length).toEqual(sensorHelper.insertedIds().length);
				done();
			}
		});
	});

	it('should get distinct hosts', function(done) {
		sensor.getUniqueHosts(function(err,result){
			expect(err).not.toBeTruthy();
			expect(result).toBeTruthy();
			expect(typeof(result.length)).toBe('number');
			expect(result.length).toEqual(3);
			done();
		});
	});
});
