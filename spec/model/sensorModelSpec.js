"use strict";
var sensor_model_1 = require("../../model/sensor.model");
var util = require('util');
//var sensor = require('../../model/sensor.js');
var sensor;
var logger = require('../../util/logger');
var sensorHelper = require('../helpers/sensor.js');
describe('Sensor Model V1', function () {
    beforeEach(function () {
        sensor = new sensor_model_1.SensorModel();
    });
    it('TODO: there is work todo', function () {
        expect("TODO").toBe("TODO");
    });
    it('check SensorModel', function () {
        expect(sensor instanceof sensor_model_1.SensorModel).toBe(true);
    });
    it('get returns ISensor array', function () {
        var sut = sensor.get();
        expect(sut instanceof Array).toBe(true);
        expect(sut.length).toBe(1);
        expect(sut[0]._id).toBe("id17");
    });
    it('getById returns single ISensor', function () {
        var sut = sensor.getByID("id15");
        expect(sut._id).toBe("id17");
    });
    it('post(obj) returns string ID', function () {
        var sut = sensor.post({ _id: "id17" });
        expect(sut).toBe("error");
    });
});
