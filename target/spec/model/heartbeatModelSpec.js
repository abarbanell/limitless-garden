"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hb_model_1 = require("../../src/model/hb.model");
var Rx_1 = require("rxjs/Rx");
var util = require('util');
//var sensor = require('../../model/sensor.js');
var hb;
var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var colname = db.collectionName('model.heartbeat');
describe('Heartbeat Model', function () {
    beforeEach(function () {
        hb = new hb_model_1.Heartbeat();
    });
    it('check Heartbeat Model', function () {
        expect(hb instanceof hb_model_1.Heartbeat).toBe(true);
    });
    it('post(obj) returns string ID', function (done) {
        var hb = new hb_model_1.Heartbeat();
        hb.host = "ESP_TEST";
        hb.uptime = (new Date()).getMinutes();
        var obs = hb.post();
        expect(obs instanceof Rx_1.Observable).toBe(true);
        logger.info("have observable, now subscribing...");
        obs.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            logger.info("Heartbeat.post returned: %s", s);
            db.connect(function (err, dbObj) {
                dbObj.collection(colname).findOne({ _id: s }, function (err, result) {
                    if (err) {
                        logger.error('findOne Error: ' + err);
                        return done();
                    }
                    logger.error('TODO: check findOne result: ' + JSON.stringify(result));
                    return done();
                });
            });
        });
    });
    // it('post(obj) can getByID again', (done) => {
    // 	var sut = sensor.post({
    // 		 name: "sensor 3",
    //   	 host: "rpi99",
    //   	 type: {
    //     	name: "soil"
    //   	 }
    // 		});
    // 	expect(sut instanceof Observable).toBe(true);
    // 	sut.subscribe(s => {
    // 		expect(s).toEqual(jasmine.any(String));
    // 		sensor.getById(s).subscribe(d => {
    // 			expect(d._id.toString()).toEqual(s);
    // 			done();
    // 		})
    // 	})
    // });
    // it('post(obj) can get again', (done) => {
    // 	var sut = sensor.post({
    // 		 name: "sensor 4",
    //   	 host: "rpi99",
    //   	 type: {
    //     	name: "soil"
    //   	 }
    // 		});
    // 	expect(sut instanceof Observable).toBe(true);
    // 	sut.subscribe(s => {
    // 		expect(s).toEqual(jasmine.any(String));
    // 		sensor.get().subscribe(d => {
    // 			expect(d.length).toBeGreaterThan(0);
    // 			expect(d[0]._id.toString().length).toEqual(24);
    // 			done();
    // 		})
    // 	})
    // });
    // it('post(obj) can delete again', (done) => {
    // 	var sut = sensor.post({
    // 		 name: "sensor 3",
    //   	 host: "rpi99",
    //   	 type: {
    //     	name: "soil"
    //   	 }
    // 		});
    // 	expect(sut instanceof Observable).toBe(true);
    // 	sut.subscribe(s => {
    // 		expect(s).toEqual(jasmine.any(String));
    // 		sensor.delete(s).subscribe(d => {
    // 			expect(d).toEqual(1);
    // 			done();
    // 		})
    // 	})
    // });
    // 	it('post(obj) and deleteAll', (done) => {
    // 	var sut = sensor.post({
    // 		 name: "sensor 3",
    //   	 host: "rpi99",
    //   	 type: {
    //     	name: "soil"
    //   	 }
    // 		});
    // 	expect(sut instanceof Observable).toBe(true);
    // 	sut.subscribe(s => {
    // 		expect(s).toEqual(jasmine.any(String));
    // 		sensor.deleteAll().subscribe(d => {
    // 			expect(d).toEqual(1);
    // 			done();
    // 		})
    // 	})
    // });
});
