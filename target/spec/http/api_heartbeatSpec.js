"use strict";
var supertest = require("supertest");
var httpStatus = require('http-status');
var util = require('util');
var logger = require("../../src/util/logger");
// system under test
var server = require("../../src/server");
describe('heartbeat route test', function () {
    it('POST heartbeat', function (done) {
        var payload = {
            host: "ESP_TEST",
            uptime: (new Date()).getMinutes()
        };
        supertest(server)
            .post('/api/heartbeat?user_key=true')
            .send(payload)
            .expect(httpStatus.OK)
            .end(function (err, res) {
            expect(err).toBeNull();
            expect(res).toBeTruthy();
            logger.error("res: " + util.inspect(res));
            expect(res.body).toBeDefined();
            logger.error('res.body: ' + util.inspect(res.body));
            expect(res.body._id).toBeDefined();
            expect(res.body.rc).toBe("OK");
            done();
        });
    });
});
