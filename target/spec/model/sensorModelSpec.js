"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_sensor_1 = require("../../src/model/model.sensor");
var Rx_1 = require("rxjs/Rx");
var util = require('util');
var sensor;
var logger = require('../../src/util/logger');
// var sensorHelper = require('../helpers/sensor');
var data = [
    {
        name: "sensor 43",
        host: "rpi77",
        type: "soil"
    },
    {
        name: "sensor 44",
        host: "rpi77",
        type: "soil"
    },
    {
        name: "sensor 01",
        host: "rpi01",
        type: "soil"
    }
];
describe('SensorModel - not prepopulated', function () {
    beforeEach(function (done) {
        sensor = model_sensor_1.SensorModel.getInstance();
        sensor.deleteAll().subscribe(function (s) {
            logger.info("SensorModel.deleteAll() BEFORE test affected %d rows", s);
            done();
        });
    });
    afterEach(function (done) {
        sensor = model_sensor_1.SensorModel.getInstance();
        sensor.deleteAll().subscribe(function (s) {
            logger.info("SensorModel.deleteAll() AFTER test affected %d rows", s);
            done();
        });
    });
    it('check SensorModel', function () {
        expect(sensor instanceof model_sensor_1.SensorModel).toBe(true);
    });
    it('get returns ISensor array', function (done) {
        var sut = sensor.get();
        sut.subscribe(function (s) {
            expect(s instanceof Array).toBe(true);
            done();
        }, function (e) {
            expect(e).toBe("you-should-not-get-here");
            done();
        });
    });
    it('getById valid id', function (done) {
        var id = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: "soil"
        });
        id.subscribe(function (strId) {
            expect(strId).toEqual(jasmine.any(String));
            logger.info("id = ", strId);
            var sut = sensor.getById(strId);
            sut.subscribe(function (s) {
                expect(s).toBeDefined();
                expect(s._id).toBe(strId);
                done();
            }, function (e) {
                expect(e.toString()).toContain("you should not get here");
                done();
            });
        }, function (e) {
            expect(e).toBe("you-should-not-get-here-either");
            done();
        });
    });
    it('getById missing id', function (done) {
        sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: "soil"
        }).subscribe(function (strId) {
            var nonExistingId = "58cd177e9900ff4a2a741bbc";
            expect(strId).toEqual(jasmine.any(String));
            expect(strId).not.toBe(nonExistingId);
            var sut = sensor.getById(nonExistingId);
            sut.subscribe(function (s) {
                expect(s).toBeNull();
                done();
            }, function (e) {
                expect(e.toString()).toContain("you should not get here");
                done();
            });
        }, function (e) {
            // could not insert before get
            expect(e).toBe("you-should-not-get-here-either");
            done();
        });
    });
    it('getById invalid id', function (done) {
        var sut = sensor.getById("invalid-ID");
        sut.subscribe(function (s) {
            // you should not get here
            expect(s).toBeNull();
            done();
        }, function (e) {
            expect(e.toString()).toBe("Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
            done();
        });
    });
    it('collectionName is sane', function () {
        var sut = sensor.getCollectionName();
        expect(sut).toContain("model");
        expect(sut).toContain("sensor");
    });
    it('post(obj) returns string ID', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: "soil"
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            expect(s.length).toBe(24);
            done();
        });
    });
    it('post(obj) can getByID again', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: "soil"
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.getById(s).subscribe(function (d) {
                expect(d._id.toString()).toEqual(s);
                done();
            });
        });
    });
    it('multiple post(obj) can find by name', function (done) {
        var sut1 = sensor.post(data[0]);
        expect(sut1 instanceof Rx_1.Observable).toBe(true);
        sut1.subscribe(function (s) {
            var sut2 = sensor.post(data[1]);
            expect(sut2 instanceof Rx_1.Observable).toBe(true);
            sut2.subscribe(function (s) {
                expect(s).toEqual(jasmine.any(String));
                var pattern = new model_sensor_1.Sensor();
                pattern.name = data[1].name;
                sensor.find(pattern).subscribe(function (d) {
                    expect(d.length).toBe(1);
                    expect(d[0].host).toBe(data[1].host);
                    done();
                });
            });
        });
    });
    it('post(obj) can get again', function (done) {
        var sut = sensor.post({
            name: "sensor 4",
            host: "rpi99",
            type: "soil"
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.get().subscribe(function (d) {
                expect(d.length).toBeGreaterThan(0);
                expect(d[0]._id.toString().length).toEqual(24);
                done();
            });
        });
    });
    it('post(obj) can delete again', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: "soil"
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.delete(s).subscribe(function (d) {
                expect(d).toEqual(1);
                done();
            });
        });
    });
    it('post(obj) and deleteAll', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: "soil"
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.deleteAll().subscribe(function (d) {
                expect(d).toEqual(1);
                done();
            });
        });
    });
    it('multiple post(obj) can get by host', function (done) {
        var sut1 = sensor.post({
            name: "sensor 44",
            host: "rpi99",
            type: "soil"
        });
        expect(sut1 instanceof Rx_1.Observable).toBe(true);
        sut1.subscribe(function (s) {
            var sut2 = sensor.post({
                name: "sensor 42",
                host: "rpi01",
                type: "soil"
            });
            expect(sut2 instanceof Rx_1.Observable).toBe(true);
            sut2.subscribe(function (s) {
                expect(s).toEqual(jasmine.any(String));
                sensor.getByHost("rpi01").subscribe(function (d) {
                    expect(d.length).toBe(1);
                    expect(d[0].host).toBe("rpi01");
                    done();
                });
            });
        });
    });
    it('multiple post(obj) and get by host returns multiple', function (done) {
        var sut1 = sensor.post({
            name: "sensor 44",
            host: "rpi77",
            type: "soil"
        });
        expect(sut1 instanceof Rx_1.Observable).toBe(true);
        sut1.subscribe(function (s) {
            var sut2 = sensor.post({
                name: "sensor 42",
                host: "rpi77",
                type: "soil"
            });
            expect(sut2 instanceof Rx_1.Observable).toBe(true);
            sut2.subscribe(function (s) {
                expect(s).toEqual(jasmine.any(String));
                sensor.getByHost("rpi77").subscribe(function (d) {
                    expect(d.length).toBe(2);
                    expect(d[0].host).toBe("rpi77");
                    expect(d[1].host).toBe("rpi77");
                    done();
                });
            });
        });
    });
});
describe('Sensor Model V1 prepopulated', function () {
    beforeEach(function (done) {
        var sensor = model_sensor_1.SensorModel.getInstance();
        sensor.deleteAll().subscribe(function (s) {
            var sut1 = sensor.post(data[0]).subscribe(function (s) {
                var sut2 = sensor.post(data[1]).subscribe(function (s) {
                    sensor.post(data[2]).subscribe(function (s) {
                        done();
                    });
                });
            });
        });
    });
    it('deleteAll', function (done) {
        sensor.get().subscribe(function (s) {
            expect(s.length).toBe(3);
            sensor.deleteAll().subscribe(function (s) {
                expect(s).toBe(3);
                sensor.get().subscribe(function (s) {
                    expect(s.length).toBe(0);
                    done();
                });
            });
        });
    });
    it('multiple post(obj) and get by host returns multiple', function (done) {
        sensor.getByHost("rpi77").subscribe(function (d) {
            expect(d.length).toBe(2);
            expect(d[0].host).toBe("rpi77");
            expect(d[1].host).toBe("rpi77");
            done();
        });
    });
    it('post same obj twice is blocked', function (done) {
        // pending("not implemented");		
        sensor.post(data[0]).subscribe(function (d) {
            expect("expected error but got: ").toBe(d);
            done();
        }, function (e) {
            expect(e).toContain("E11000 duplicate key error");
            done();
        });
    });
    it('get by host fails for nonexisting host', function (done) {
        sensor.getByHost("no-host").subscribe(function (d) {
            expect(d.length).toBe(0);
            done();
        });
    });
    it('find all yields three result2', function (done) {
        var pattern = new model_sensor_1.Sensor();
        sensor.find(pattern).subscribe(function (d) {
            expect(d.length).toBe(3);
            done();
        });
    });
    it('find by host and type yields single result', function (done) {
        var pattern = new model_sensor_1.Sensor();
        pattern.host = "rpi01";
        pattern.type = "soil";
        sensor.find(pattern).subscribe(function (d) {
            expect(d.length).toBe(1);
            done();
        });
    });
    it('find by host and type yields duplicate', function (done) {
        var pattern = new model_sensor_1.Sensor();
        pattern.host = "rpi77";
        pattern.type = "soil";
        sensor.find(pattern).subscribe(function (d) {
            expect(d.length).toBe(2);
            done();
        });
    });
    it('find by host and type yields no result', function (done) {
        var pattern = new model_sensor_1.Sensor();
        pattern.host = "rpi99";
        pattern.type = "soil";
        sensor.find(pattern).subscribe(function (d) {
            expect(d.length).toBe(0);
            done();
        });
    });
});
//# sourceMappingURL=sensorModelSpec.js.map