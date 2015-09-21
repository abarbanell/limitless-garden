// router tests...

var expect = require('expect.js');

process.env.THREESCALE_PROVIDER_KEY='dummykey';
var apiRouter = require('../routes/api.js');

describe('API router tests', function() {
  it('router should be valid', function(){
      expect(apiRouter).to.be.ok();
			expect(apiRouter.get).to.be.an('function');
  });

  it('dummy - check some syntax of expect.js', function(done) {
    var f = function(){};
    expect(f).to.be.an('function');
    expect(f.doesnotexist).to.not.be.an('function'); // should fail
    expect(f.bind).to.be.an('function'); // Function.prototype.bind()
		done();
  })

});

