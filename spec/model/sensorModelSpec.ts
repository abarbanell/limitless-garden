import { SensorModel, Sensor, ISensor } from '../../src/model/model.sensor';
import { Observable } from 'rxjs/Rx';

var util = require('util');
var sensor: SensorModel; 

var logger = require('../../src/util/logger');
// var sensorHelper = require('../helpers/sensor');

var data: ISensor[] = [
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

describe('SensorModel - not prepopulated', function() {
	beforeEach ((done) => {
		sensor = SensorModel.getInstance();
		sensor.deleteAll().subscribe(s => {
			logger.error("SensorModel.deleteAll() affected %d rows", s)
			done()
		})
	});

	afterEach ((done) => {
		logger.error("TODO: sensorModelSpec.ts change to afterAll()");
		sensor = SensorModel.getInstance();
		sensor.deleteAll().subscribe(s => {
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
			type: "soil"
		});
		id.subscribe(strId => {
			expect(strId).toEqual(jasmine.any(String));
			logger.info("id = ", strId);
			var sut = sensor.getById(strId);
			sut.subscribe(s => {
				expect(s).toBeDefined();
				expect(s._id).toBe(strId);
				done();
			}, e => {
				expect(e.toString()).toContain("you should not get here");
				done();
			})
		}, e => {
			expect(e).toBe("you-should-not-get-here-either");
			done();
		});
	});

	it('getById missing id', (done) => {
		sensor.post({
			name: "sensor 3",
			host: "rpi99",
			type: "soil"
		}).subscribe(strId => {
			let nonExistingId = "58cd177e9900ff4a2a741bbc";
			expect(strId).toEqual(jasmine.any(String));
			logger.error("inserted id = ", strId);
			logger.error("non-existing id = ", nonExistingId);
			expect(strId).not.toBe(nonExistingId);
			var sut = sensor.getById(nonExistingId);
			sut.subscribe(s => {
				expect(s).toBeNull();
				done();
			}, e => {
				expect(e.toString()).toContain("you should not get here");
				done();
			})
		}, e => {
			// could not insert before get
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
			expect(e.toString()).toBe("Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
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
			type: "soil"
		});
		expect(sut instanceof Observable).toBe(true);
		sut.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			expect(s.length).toBe(24);
			done();
		})
	});

	it('post(obj) can getByID again', (done) => {
		var sut = sensor.post({
			name: "sensor 3",
			host: "rpi99",
			type: "soil"
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


	it('multiple post(obj) can find by name', (done) => {
		let sut1 = sensor.post(data[0]);
		expect(sut1 instanceof Observable).toBe(true);
		sut1.subscribe(s => {
			logger.error("sensor inserted as id %s: %s", s, util.inspect(data[0]));
			let sut2 = sensor.post(data[1]);
			expect(sut2 instanceof Observable).toBe(true);
			sut2.subscribe(s => {
				logger.error("sensor inserted as id %s: %s", s, util.inspect(data[1]));
				expect(s).toEqual(jasmine.any(String));
				let pattern = new Sensor();
				pattern.name = data[1].name;
				logger.error("pattern for find: %s", util.inspect(pattern));
				sensor.find(pattern).subscribe(d => {
						logger.error("find %s returned: %s", util.inspect(pattern), util.inspect(d));
					expect(d.length).toBe(1);
					expect(d[0].host).toBe(data[1].host);
					done();
				})
			})
		})
	});

	
	it('post(obj) can get again', (done) => {
		var sut = sensor.post({
			name: "sensor 4",
			host: "rpi99",
			type: "soil"
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
			type: "soil"
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
				type: "soil"
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
			type: "soil"
		});
		expect(sut1 instanceof Observable).toBe(true);
		sut1.subscribe(s => {
			var sut2 = sensor.post({
				name: "sensor 42",
				host: "rpi01",
				type: "soil"
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
			type: "soil"
		});
		expect(sut1 instanceof Observable).toBe(true);
		sut1.subscribe(s => {
			var sut2 = sensor.post({
				name: "sensor 42",
				host: "rpi77",
				type: "soil"
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

	beforeEach ((done) => {
		let sensor = SensorModel.getInstance();
		sensor.deleteAll().subscribe(s => {
			let sut1 = sensor.post(data[0]).subscribe(s => {
			 let sut2 = sensor.post(data[1]).subscribe(s => {
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

	it('multiple post(obj) and get by host returns multiple', (done) => {
		sensor.getByHost("rpi77").subscribe(d => {
			expect(d.length).toBe(2);
			expect(d[0].host).toBe("rpi77");
			expect(d[1].host).toBe("rpi77");
			done();
		})
	});	
	
	it('post same obj twice is blocked', (done) => {
		// pending("not implemented");		
		sensor.post(data[0]).subscribe(d => {
			expect("expected error but got: ").toBe(d);
			done();
		},
		e => {
			expect(e).toContain("E11000 duplicate key error");
			done();
		})
	});

	it('get by host fails for nonexisting host', (done) => {
		sensor.getByHost("no-host").subscribe(d => {
			expect(d.length).toBe(0);
			done();
		})
	});
	
	it('find all yields three result2', (done) => {
		var pattern: ISensor = new Sensor();
		logger.error("find pattern: %s", util.inspect(pattern))
		sensor.find(pattern).subscribe(d => {
			logger.error("find result: %s", util.inspect(d))			
			expect(d.length).toBe(3);
			done();
		})
	});

	it('find by host and type yields single result', (done) => {
		var pattern: ISensor = new Sensor();
		pattern.host = "rpi01";
		pattern.type = "soil";
		logger.error("find pattern: %s", util.inspect(pattern))
		sensor.find(pattern).subscribe(d => {
			logger.error("find result: %s", util.inspect(d))			
			expect(d.length).toBe(1);
			done();
		})
	});

	it('find by host and type yields duplicate', (done) => {
		var pattern: ISensor = new Sensor();
		pattern.host = "rpi77";
		pattern.type = "soil";		
		logger.error("find pattern: %s", util.inspect(pattern))
		sensor.find(pattern).subscribe(d => {
			logger.error("find result: %s", util.inspect(d))						
			expect(d.length).toBe(2);
			done();
		})
	});

	it('find by host and type yields no result', (done) => {
		var pattern: ISensor = new Sensor();
		pattern.host = "rpi99";
		pattern.type = "soil";		
		sensor.find(pattern).subscribe(d => {
			expect(d.length).toBe(0);
			done();
		})
	});


});

