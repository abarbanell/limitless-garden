// test util/logger.js
// require logger ad check we have function error(), info()

var logger = require('../../util/logger');

describe('logger tests', function() {

	it('check default logger object', function(done){
		expect(logger).toBeTruthy();
    expect(typeof(logger.error)).toEqual('function');
    expect(typeof(logger.info)).toEqual('function');
    expect(typeof(logger.warn)).toEqual('function');
		expect(logger.level).toEqual(process.env.LOG_LEVEL || 'error');
		done();
  });

});
