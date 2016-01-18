// router tests...

var expect = require('expect.js');

process.env.THREESCALE_PROVIDER_KEY='dummykey';
var apiRouter = require('../routes/api');
var ts = require('../util/threescale');

describe('API router tests', function() {
  it('router should be valid', function(done){
      expect(apiRouter).to.be.ok();
			expect(apiRouter.get).to.be.an('function');
			done();
  });

  it('threescale middleware tests', function(done) {
    expect(ts).to.be.an('function');
		done();
  })

});

