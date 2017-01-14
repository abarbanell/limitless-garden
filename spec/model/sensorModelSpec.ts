import { SensorModel } from '../../model/sensor.model';

var util = require('util');
//var sensor = require('../../model/sensor.js');
var sensor: SensorModel; 

var logger = require('../../util/logger');
var sensorHelper = require('../helpers/sensor.js');

describe('Sensor Model V1', function() {
	beforeEach (() => {
		sensor = new SensorModel();
});

	it('TODO: there is work todo', function() {
		expect("TODO").toBe("TODO");
	});

	it('check SensorModel', () => {
		expect(sensor instanceof SensorModel).toBe(true);
	});

	it('get returns ISensor array', () => {
		var sut = sensor.get();
		expect(sut instanceof Array).toBe(true);
		expect(sut.length).toBe(1);
		expect(sut[0]._id).toBe("id17");
	});

	it('getById returns single ISensor', () => {
		var sut = sensor.getByID("id15");
		expect(sut._id).toBe("id17");
	});

	it('post(obj) returns string ID', () => {
		var sut = sensor.post({ _id: "id17"});
		expect(sut).toBe("error");
	})
});

