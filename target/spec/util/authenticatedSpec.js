// test for util/authenticated middleware
var auth = require('../../src/util/authenticated.js');
var httpMocks = require('node-mocks-http');
var logger = require('../../src/util/logger.js');
var util = require('util');
describe('Middleware test for authentication', function () {
    it('check passport authentication - happy path', function (done) {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/test/path',
            isAuthenticated: function () { return true; }
        });
        var response = httpMocks.createResponse();
        auth.cookie(request, response, function next(error) {
            if (error) {
                expect("error received").toBe(error);
            }
            ;
            expect(response.statusCode).toEqual(200);
            done();
        });
    });
    it('check passport authentication - not authenticated', function (done) {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/test/path',
            isAuthenticated: function () { return false; }
        });
        var response = httpMocks.createResponse();
        response.redirect = function (url) {
            expect(url).toEqual('/login');
            done();
        };
        auth.cookie(request, response, function next(error) {
            if (error) {
                expect("error received").toBe(error);
            }
            ;
            // you should not get here
            expect(response.statusCode).not.toEqual(200);
            done();
        });
    });
    it("check environment for API_KEYS", function () {
        var str = process.env.API_KEYS;
        expect(str).toBeDefined();
        expect(typeof (str)).toBe("string");
        var obj = JSON.parse(str);
        logger.info("API_KEYS: " + util.inspect(obj));
        expect(typeof (obj.includes)).toBe("function");
        expect(obj.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=authenticatedSpec.js.map