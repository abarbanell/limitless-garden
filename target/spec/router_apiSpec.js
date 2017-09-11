// should have router unit tests, i.e. without backend
var apiRouter = require('../src/routes/api');
describe('API router tests', function () {
    it('router should be valid', function (done) {
        expect(apiRouter).toBeTruthy();
        expect(typeof (apiRouter.get)).toBe('function');
        done();
    });
});
