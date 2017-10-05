// test util/statsd.js
import { statsdHits, statsdData } from '../../src/util/statsd';

describe('statsd tests', function () {
    

    it('check statsd config', function (done) {
        expect(typeof(process.env.STATSD_HOST)).toBe("string");
        expect(typeof(process.env.STATSD_PORT)).toBe("string");
        done();
    });

    it('check statsdHits is a function', function (done) {
        expect(typeof(statsdHits)).toBe("function");
        done();
    });

    it('middleware test - find next() exit', function (done) {
        var req = {
            method: "GET",
            originalURL: "http://localhost/api/test"
        };
        var res = {

        };
        var next = function() {
            done();
        }
        statsdHits(req,res,next);
    })

    it('check statsdData is a function', function (done) {
        expect(typeof(statsdData)).toBe("function");
        done();
    });

    it('middleware test - statsd and next() exit', function (done) {
        var req = {
            method: "POST",
            originalURL: "http://localhost/api/test",
            body: { 
                host: "testhost",
                temperature: 17,
                soil: 4
            },
            params: {
                collectionName: "sensor"
            }
        };
        var res = {

        };
        var next = function() {
            done();
        }
        statsdData(req,res,next);
    })

});
