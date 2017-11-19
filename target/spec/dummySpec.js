// dummy tests...
// var expect = require('expect.js');
describe('Array bound tests (dummy)', function () {
    it('should fail for 0 and 5,  out of bounds in our array', function () {
        expect([1, 2, 3].indexOf(5)).toEqual(-1);
        expect([1, 2, 3].indexOf(0)).toEqual(-1);
    });
    it('check some syntax of expect.js', function (done) {
        var f = function () { };
        expect(typeof (f)).toEqual('function');
        expect(f.doesnotexist).toBeUndefined(); // should fail
        expect(typeof (f.bind)).toEqual('function'); // Function.prototype.bind()
        done();
    });
});
//# sourceMappingURL=dummySpec.js.map