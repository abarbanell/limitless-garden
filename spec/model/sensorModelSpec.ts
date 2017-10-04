import { SensorModel, Sensor, ISensor } from '../../src/model/model.sensor';
import { Observable } from 'rxjs/Rx';

var util = require('util');
//var sensor = require('../../model/sensor.js');
var sensor: SensorModel; 

var logger = require('../../src/util/logger');
var sensorHelper = require('../helpers/sensor.js');

describe('Sensor Model V1', function() {
	beforeEach ((done) => {
		sensor = new SensorModel();
		sensor.deleteAll().subscribe(s => {
			logger.info("deleteAll done");
			done()
		})
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

	it('getById valid id', (done) => {
		var id = sensor.post({
			 name: "sensor 3",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
		});
		id.subscribe(strId => {
			expect(strId).toEqual(jasmine.any(String));
			logger.info("id = ", strId);
			var sut = sensor.getById(strId);
			sut.subscribe(s => {
				expect(s._id).toBe(strId);
				done();
			}, e => {
				expect(e.toString()).toContain("you should not get here");
				done();
		})
			done();
		}, e => {
			expect(e).toBe("you-should-not-get-here-either");
		 	done();
		});
	});

	it('getById missing id', (done) => {
		var id = sensor.post({
			 name: "sensor 3",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
		});
		id.subscribe(strId => {
			let nonExistingId = "58cd177e9900ff4a2a741bbc";
			expect(strId).toEqual(jasmine.any(String));
			logger.info("inserted id = ", strId);
			logger.info("non-existing id = ", nonExistingId);
			expect(strId).not.toBe(nonExistingId);
			var sut = sensor.getById(nonExistingId);
			sut.subscribe(s => {
				logger.info("got s = ", s);
				expect(s).toBeNull();
				done();
			}, e => {
				logger.error('got e = ', e);
				expect(e.toString()).toContain("you should not get here");
				done();
			})
		}, e => {
			logger.error('could not insert before get, e = ', e);
			expect(e).toBe("you-should-not-get-here-either");
		 	done();
		});
	});

	it('getById invalid id', (done) => {
		var sut = sensor.getById("invalid-ID");
		sut.subscribe(s => {
			// you should not get here
			expect(s).toBeNull();
			done();
		}, e => {
			expect(e.toString()).toContain("Argument passed");
			done();
		})
	});

	it('collectionName is sane', () => {
		var sut = sensor.getCollectionName();
		expect(sut).toContain("model");
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


	it('multiple post(obj) can find by pattern', (done) => {
		var sut1 = sensor.post({
			 name: "sensor 44",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut1 instanceof Observable).toBe(true);
		sut1.subscribe(s => {
			var sut2 = sensor.post({
				name: "sensor 42",
				host: "rpi01",
				type: {
				 name: "soil"
				}
			});
			expect(sut2 instanceof Observable).toBe(true);
			sut2.subscribe(s => {
				expect(s).toEqual(jasmine.any(String));
				var sen = new Sensor();
				sen.host = "rpi01";
				sen.type = { name: "soil"} ;
				sensor.find(sen).subscribe(d => {
					expect(d.length).toBe(1);
					expect(d[0].host).toBe("rpi01");
					done();
				})
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

		it('post(obj) and deleteAll', (done) => {
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
			sensor.deleteAll().subscribe(d => {
				expect(d).toEqual(1);
				done();
			})
		})
	});

	it('multiple post(obj) can get by host', (done) => {
		var sut1 = sensor.post({
			 name: "sensor 44",
    	 host: "rpi99",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut1 instanceof Observable).toBe(true);
		sut1.subscribe(s => {
			var sut2 = sensor.post({
				name: "sensor 42",
				host: "rpi01",
				type: {
				 name: "soil"
				}
			});
			expect(sut2 instanceof Observable).toBe(true);
			sut2.subscribe(s => {
				expect(s).toEqual(jasmine.any(String));
				sensor.getByHost("rpi01").subscribe(d => {
					expect(d.length).toBe(1);
					expect(d[0].host).toBe("rpi01");
					done();
				})
			})
		})
	});




	it('multiple post(obj) and get by host returns multiple', (done) => {
		var sut1 = sensor.post({
			 name: "sensor 44",
    	 host: "rpi77",
    	 type: {
      	name: "soil"
    	 }
			});
		expect(sut1 instanceof Observable).toBe(true);
		sut1.subscribe(s => {
			var sut2 = sensor.post({
				name: "sensor 42",
				host: "rpi77",
				type: {
				 name: "soil"
				}
			});
			expect(sut2 instanceof Observable).toBe(true);
			sut2.subscribe(s => {
				expect(s).toEqual(jasmine.any(String));
				sensor.getByHost("rpi77").subscribe(d => {
					expect(d.length).toBe(2);
					expect(d[0].host).toBe("rpi77");
					expect(d[1].host).toBe("rpi77");
					done();
				})
			})
		})
	});
});

describe('Sensor Model V1 prepopulated', function() {
	var data = [
		{
			name: "sensor 43",
			host: "rpi77",
			type: {
				name: "soil"
			}
		},
		{
			name: "sensor 44",
			host: "rpi77",
			type: {
				name: "soil"
			}
		},
		{
			name: "sensor 01",
			host: "rpi01",
			type: {
				name: "soil"
			}
		}
	];
	beforeEach ((done) => {
		sensor = new SensorModel();
		sensor.deleteAll().subscribe(s => {
			logger.error("deleteAll done");
			var sut1 = sensor.post(data[0]).subscribe(s => {
			 var sut2 = sensor.post(data[1]).subscribe(s => {
				sensor.post(data[2]).subscribe(s => {
					done();
				})
			 })
		 })
		})
	});

	it('deleteAll', (done) => {
		sensor.get().subscribe(s => {
			expect(s.length).toBe(3);
			sensor.deleteAll().subscribe(s => {
				expect(s).toBe(3);
				sensor.get().subscribe(s => {
					expect(s.length).toBe(0);
					done();
				})
			})
		})
	})

	it('multiple post(obj) and get by host returns multple', (done) => {
		sensor.getByHost("rpi77").subscribe(d => {
			expect(d.length).toBe(2);
			expect(d[0].host).toBe("rpi77");
			expect(d[1].host).toBe("rpi77");
			done();
		})
	});

	it('get by host fails for nonexisting host', (done) => {
		sensor.getByHost("no-host").subscribe(d => {
			expect(d.length).toBe(0);
			done();
		})
	});

});

