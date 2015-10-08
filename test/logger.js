// test util/logger.js
// require logger ad check we have function error(), info()

var expect = require('expect.js');
var logger = require('../util/logger');

describe('logger tests', function() {

	it('check default logger object', function(done){
		expect(logger).to.be.ok();
    expect(logger.error).to.be.an('function');
    expect(logger.info).to.be.an('function');
    expect(logger.warn).to.be.an('function');
		expect(logger.level).to.eql(process.env.LOG_LEVEL || 'error');
		done();
  });

});
