"use strict";
var supertest = require("supertest");
var httpStatus = require('http-status');
// system under test
var server = require("../../src/server");
describe('heartbeat route test', function () {
    it('POST heartbeat', function (done) {
        var payload = {
            host: "ESP_TEST",
            uptime: (new Date()).getMinutes()
        };
        expect(true).toBe(false);
        supertest(server)
            .post('/api/heartbeat?user_key=true')
            .send(payload)
            .expect(httpStatus.OK)
            .end(function (err, res) {
            logger.error('res.body: ', res.body);
            expect(res.body._id).toBeDefined();
            expect(res.body.rc).toBeDefined();
            done();
        });
    });
});
// router.post('/', function(req, res, next) {
// 	try {
// 		var hb = new Heartbeat();
// 		hb.populate(req.body);
// 		hb.post().subscribe(s => {
// 			var str: string = s;
// 			var payload = { _id: str, rc: "OK" }
// 			res.json(payload);
// 		}, e=> {
// 			logger.error('post failed: ', e);
// 		})
// 	} catch (ex) {
// 		logger.error('heartbeat router post("/") exception ', ex);
// 	}
// })
