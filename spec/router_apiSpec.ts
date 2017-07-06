// router tests...

process.env.THREESCALE_PROVIDER_KEY='dummykey';
var apiRouter = require('../src/routes/api');
var ts = require('../src/util/threescale');

describe('API router tests', function() {
  it('router should be valid', function(done){
      expect(apiRouter).toBeTruthy();
			expect(typeof(apiRouter.get)).toBe('function');
			done();
  });

  it('threescale middleware tests', function(done) {
    expect(typeof(ts)).toBe('function');
		done();
  })

});

