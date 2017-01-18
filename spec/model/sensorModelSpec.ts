import { SensorModel } from '../../model/sensor.model';
import { Observable } from 'rxjs/Rx';

var util = require('util');
//var sensor = require('../../model/sensor.js');
var sensor: SensorModel; 

var logger = require('../../util/logger');
var sensorHelper = require('../helpers/sensor.js');

describe('Sensor Model V1', function() {
	beforeEach (() => {
		sensor = new SensorModel();
	});

	it('check SensorModel', () => {
		expect(sensor instanceof SensorModel).toBe(true);
	});

	it('get returns ISensor array', (done) => {
		var sut = sensor.get();
		sut.subscribe(s => {
			expect(s instanceof Array).toBe(true);
			done();
		}, e => {
			expect(e).toBe("you-should-not-get-here");
			done();
		});
	});

	it('getById invalid id', (done) => {
		var sut = sensor.getById("invalid-ID");
		sut.subscribe(s => {
			expect(s).toBe("you-should-not-get-here");
			done();
		}, e => {
			expect(e.toString()).toContain("Argument passed");
			done();
		})
	});

	it('collectionName is sane', () => {
		var sut = sensor.getCollectionName();
		expect(sut).toContain("sensor");
	});

	it('post(obj) returns string ID', (done) => {
		var sut = sensor.post({
			 name: "sensor 3",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut instanceof Observable).toBe(true);
		sut.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			done();
		})
	});

	it('post(obj) can getByID again', (done) => {
		var sut = sensor.post({
			 name: "sensor 3",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut instanceof Observable).toBe(true);
		sut.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			sensor.getById(s).subscribe(d => {
				expect(d._id.toString()).toEqual(s);
				done();
			})
		})
	});

	it('post(obj) can get again', (done) => {
		var sut = sensor.post({
			 name: "sensor 4",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut instanceof Observable).toBe(true);
		sut.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			sensor.get().subscribe(d => {
				expect(d.length).toBeGreaterThan(0);
				expect(d[0]._id.toString().length).toEqual(24);
				done();
			})
		})
	});

		it('post(obj) can delete again', (done) => {
		var sut = sensor.post({
			 name: "sensor 3",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut instanceof Observable).toBe(true);
		sut.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			sensor.delete(s).subscribe(d => {
				expect(d).toEqual(1);
				done();
			})
		})
	});

});

