// test util/statsd.js
import { statsdHits } from '../../util/statsd';

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
            console.info("next called");
            done();
        }
        statsdHits(req,res,next);
    })

});
