"use strict";
var supertest = require("supertest");
var httpStatus = require('http-status');
// system under test
var server = require("../../src/server");
var logger = require("../../src/util/logger");
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
            expect(res).toBeDefined();
            expect(res.body).toBeDefined();
            logger.info('res.body: ', res.body);
            expect(res.body._id).toBeDefined();
            expect(res.body.rc).toBe("OK");
            done();
        });
    });
});
