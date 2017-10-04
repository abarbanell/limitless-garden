import { Heartbeat } from '../../src/model/model.heartbeat';
import { Observable } from 'rxjs/Rx';

var util = require('util');
//var sensor = require('../../model/sensor.js');
var hb: Heartbeat;

var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var colname = db.collectionName('model.heartbeat');
import mongodb = require('mongodb');


describe('Heartbeat Model', function () {
	beforeEach((done) => {
		hb = new Heartbeat();
		hb.deleteAll().subscribe(s => {
			logger.info("deleteAll done");
			done()
		})
	});

	it('check Heartbeat Model', () => {
		expect(hb instanceof Heartbeat).toBe(true);
	});

	it('post(minimal obj) returns string ID', (done) => {
		var hb: Heartbeat = new Heartbeat();
		hb.host = "ESP_TEST";
		hb.uptime = (new Date()).getMinutes();

		var obs = hb.post();
		expect(obs instanceof Observable).toBe(true);
		obs.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			logger.info("Heartbeat.post returned: %s", s);
			db.connect(function (err, dbObj) {
				var oid = new mongodb.ObjectId.createFromHexString(s)
				dbObj.collection(colname).findOne({ _id: oid }, function (err, res) {
					if (err) {
						logger.error('findOne Error: ' + err);
						return done();
					}
					expect(res).toBeTruthy();
					logger.info('findOne result: ' + JSON.stringify(res));
					expect(res.host).toBe(hb.host);
					expect(res.uptime).toBe(hb.uptime);
					expect(res.date).toBeDefined();
					return done();
				});
			});
		})
	});

	it('post(full obj) returns string ID', (done) => {
		var hb: Heartbeat = new Heartbeat();
		hb.host = "ESP_TEST";
		hb.uptime = (new Date()).getMinutes();
		hb.i2cDevices = 0
		hb.values = [
			{ type: "soil", val: 17 },
			{ type: "temperature", val: 27.3 }
		];

		var obs = hb.post();
		expect(obs instanceof Observable).toBe(true);
		obs.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			logger.info("Heartbeat.post returned: %s", s);
			db.connect(function (err, dbObj) {
				var oid = new mongodb.ObjectId.createFromHexString(s)
				dbObj.collection(colname).findOne({ _id: oid }, function (err, res) {
					if (err) {
						logger.error('findOne Error: ' + err);
						return done();
					}
					expect(res).toBeTruthy();
					logger.info('findOne result: ' + JSON.stringify(res));
					expect(res.host).toBe(hb.host);
					expect(res.uptime).toBe(hb.uptime);
					expect(res.date).toBeDefined();
					return done();
				});
			});
		})
	});


});

describe("heartbeat model prepopulated tests", function () {
	var insertedId: string;
	beforeEach((done) => {
		hb = new Heartbeat();
		hb.deleteAll().subscribe(s => {
			logger.info("deleteAll done");
			hb.host = "ESP_TEST";
			hb.uptime = (new Date()).getMinutes();
			hb.i2cDevices = 0
			hb.values = [
				{ type: "soil", val: 17 },
				{ type: "temperature", val: 27.3 }
			];
			hb.post().subscribe(s => {
				expect(s).toEqual(jasmine.any(String));
				insertedId = s;
				done()
			});
		});
	});

	it('deleteAll', (done) => {
		var hb: Heartbeat = new Heartbeat();
		hb.deleteAll().subscribe(d => {
			expect(d).toEqual(1);
			done();
		})
	});

	it('get by ID', (done) => {
		logger.error("ID to get: %s", insertedId);
		Heartbeat.getByID(insertedId).subscribe(d => {
			expect(typeof(d)).toBe("object");
			done();
		})
	});

	it('get by ID - NOT FOUND', (done) => {
		logger.error("ID to get: %s", insertedId);
		var hb = new Heartbeat();
		hb.deleteAll().subscribe(removed => {
			Heartbeat.getByID(insertedId).subscribe(d => {
				expect("You should get an exception").toBe("NOT FOUND");
				done();
			}, err => {
				expect(err.toString()).toBe("NOT FOUND");
				done();
			})	
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

