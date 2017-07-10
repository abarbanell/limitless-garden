"use strict";
// test util/statsd.js
var statsd_1 = require("../../src/util/statsd");
describe('statsd tests', function () {
    it('check statsd config', function (done) {
        expect(typeof (process.env.STATSD_HOST)).toBe("string");
        expect(typeof (process.env.STATSD_PORT)).toBe("string");
        done();
    });
    it('check statsdHits is a function', function (done) {
        expect(typeof (statsd_1.statsdHits)).toBe("function");
        done();
    });
    it('middleware test - find next() exit', function (done) {
        var req = {
            method: "GET",
            originalURL: "http://localhost/api/test"
        };
        var res = {};
        var next = function () {
            console.info("next called");
            done();
        };
        statsd_1.statsdHits(req, res, next);
    });
});
