var expect = require('expect.js');
var sensor = require('../model/sensor.js');
var logger = require('../util/logger');
var db = require('../util/db');


describe('Sensor Model ', function() {
	beforeEach(function() {
		logger.info('beforeEach: remove and insert some data');
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

	it('should get an array of values', function(done) {
		done();
	});
});
