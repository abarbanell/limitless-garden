// router tests...

process.env.THREESCALE_PROVIDER_KEY='dummykey';
var apiRouter = require('../routes/api');
var ts = require('../util/threescale');

describe('API router tests', function() {
  it('router should be valid', function(done){
      expect(apiRouter).toBeTruthy();
			expect(apiRouter.get).toBeA(Function);
			done();
  });

  it('threescale middleware tests', function(done) {
    expect(ts).toBeA(Function);
		done();
  })

});

