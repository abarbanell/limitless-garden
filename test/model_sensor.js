var expect = require('expect.js');
var sensor = require('../model/sensor.js');
var logger = require('../util/logger');

describe('Sensor Model ', function() {
  it('should contain get and getMulti methods ', function(){
      expect(sensor).to.be.an('object');
      expect(sensor.get).to.be.an('function');
      expect(sensor.getMulti).to.be.an('function');	
  });

	it('get a single value - notfound', function(done) {
		sensor.get("notexistingid", function(err, result) { 
			if (err) logger.info('err = ' + JSON.stringify(err));
			// currently failing with connection refused - need to have proper mongo credentials for test
			// expect(err).to.not.be.ok();
			
		  done();
		});
	});

	it('should get an array of values', function(done) {
		done();
	});
});
