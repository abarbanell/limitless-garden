"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest = require("supertest");
var httpStatus = require('http-status');
var util = require('util');
var logger = require("../../src/util/logger");
// system under test
var str = process.env.API_KEYS;
var obj = JSON.parse(str);
var user_key = obj[0];
var port = process.env.TEST_PORT || "4321";
process.env.PORT = port;
var server = require("../../src/server");
describe('heartbeat route test', function () {
    it('server should be valid', function (done) {
        expect(server).toBeTruthy();
        expect(server.listen).toBeDefined();
        done();
    });
    it('port should be set', function (done) {
        expect(port).toBeTruthy();
        logger.info('port=%s', port);
        done();
    });
    it('user_key should be set', function (done) {
        expect(user_key).toBeTruthy();
        logger.info('user_key=%s', user_key);
        done();
    });
    it('POST heartbeat - small payload', function (done) {
        var payload = {
            host: "ESP_TEST",
            uptime: (new Date()).getMinutes()
        };
        supertest(server)
            .post('/api/heartbeat?user_key=' + user_key)
            .send(payload)
            .expect(httpStatus.OK)
            .end(function (err, res) {
            logger.info("err: " + util.inspect(err));
            expect(err).toBeNull();
            expect(res).toBeTruthy();
            expect(res.body).toBeDefined();
            logger.info('res.body: ' + util.inspect(res.body));
            expect(res.body._id).toBeDefined();
            expect(res.body.rc).toBe("OK");
            done();
        });
    });
    it('POST heartbeat - payload with values', function (done) {
        var payload = {
            host: "ESP_TEST",
            uptime: (new Date()).getMinutes(),
            i2cDevices: 0,
            values: [
                { type: "soil", val: 17 },
                { type: "temperature", val: 27.3 }
            ]
        };
        supertest(server)
            .post('/api/heartbeat?user_key=' + user_key)
            .send(payload)
            .expect(httpStatus.OK)
            .end(function (err, res) {
            logger.info("err: " + util.inspect(err));
            expect(err).toBeNull();
            expect(res).toBeTruthy();
            expect(res.body).toBeDefined();
            logger.info('res.body: ' + util.inspect(res.body));
            expect(res.body._id).toBeDefined();
            expect(res.body.rc).toBe("OK");
            done();
        });
    });
});
