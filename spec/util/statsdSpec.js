// test util/statsd.js

var statsd = require('../../util/statsd');

describe('statsd tests', function () {

    it('check statsd config', function (done) {
        expect(process.env.STATSD_HOST).toBeA(String);
        expect(process.env.STATSD_PORT).toBeA(String);
        done();
    });

    it('check default statsd object', function (done) {
        expect(statsd).toBeA(Object);
        expect(statsd.statsdHits).toBeA(Function);
        done();
    });

});
