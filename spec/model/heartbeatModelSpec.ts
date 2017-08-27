import { Heartbeat } from '../../src/model/hb.model';
import { Observable } from 'rxjs/Rx';

var util = require('util');
//var sensor = require('../../model/sensor.js');
var hb: Heartbeat; 

var logger = require('../../src/util/logger');


describe('Heartbeat Model', function() {
	beforeEach (() => {
		hb = new Heartbeat();
	});

	it('check Heartbeat Model', () => {
		expect(hb instanceof Heartbeat).toBe(true);
	});

	it('post(obj) returns string ID', (done) => {
		var hb: Heartbeat = new Heartbeat();
		hb.host = "ESP_TEST";
		hb.uptime = (new Date()).getMinutes();
		
		var obs = hb.post();
		expect(obs instanceof Observable).toBe(true);
		obs.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			logger.info("Heartbeat.post returned: %s", s);
			done();
		})
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

