// dummy tests...

var expect = require('expect.js');

describe('Array bound tests (dummy)', function() {
  it('should fail for 0 and 5,  out of bounds in our array', function(){
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
  });

  it('check some syntax of expect.js', function(done) {
    var f = function(){};
    expect(f).to.be.an('function');
    expect(f.doesnotexist).to.not.be.an('function'); // should fail
    expect(f.bind).to.be.an('function'); // Function.prototype.bind()
		done();
  })

});

