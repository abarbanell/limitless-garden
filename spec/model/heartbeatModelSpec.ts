import { Heartbeat, MongoHeartbeat } from '../../src/model/model.heartbeat';
import { SensorModel, Sensor, ISensor } from '../../src/model/model.sensor';
import { Observable } from 'rxjs/Rx';

var util = require('util');
var hb: Heartbeat;

var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var colname = db.collectionName('model.heartbeat');
import mongodb = require('mongodb');

function getHeartbeatObject() {
	let hb: Heartbeat = new Heartbeat();
	hb.host = "ESP_TEST";
	hb.uptime = (new Date()).getMinutes();
	hb.i2cDevices = 0
	hb.values = [
		{ type: "soil", val: 17 },
		{ type: "temperature", val: 27.3 }
	];
	return hb
}

describe('Heartbeat Model', function () {
	beforeEach((done) => {
		hb = getHeartbeatObject();
		let sensor = SensorModel.getInstance();
		hb.deleteAll().subscribe(hb => {
			sensor.deleteAll().subscribe(s => {
				logger.info("beforeEach: Heartbeat and Sensor deleteAll() done'");
				done();
			})
		})
	});

	it('check Heartbeat Model', () => {
		expect(hb instanceof Heartbeat).toBe(true);
	});

	it('post(minimal obj) returns string ID', (done) => {
		let hb: Heartbeat = new Heartbeat();
		hb.host = "ESP_TEST";
		hb.uptime = Date.now(); 

		let obs = hb.post();
		expect(obs instanceof Observable).toBe(true);
		obs.subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			db.connect(function (err, dbObj) {
				let oid = new mongodb.ObjectId.createFromHexString(s)
				dbObj.collection(colname).findOne({ _id: oid }, function (err, res) {
					expect(err).toBeNull();
					expect(res).toBeTruthy();
					expect(res.host).toBe(hb.host);
					expect(res.uptime).toBe(hb.uptime);
					expect(res.date).toBeDefined();
					return done();
				});
			});
		})
	});

	it('post(full obj) returns string ID', (done) => {

		hb.post().subscribe(s => {
			expect(s).toEqual(jasmine.any(String));
			db.connect(function (err, dbObj) {
				let oid = new mongodb.ObjectId.createFromHexString(s)
				dbObj.collection(colname).findOne({ _id: oid }, function (err, res) {
					expect(err).toBeNull();
					expect(res).toBeTruthy();
					expect(res.host).toBe(hb.host);
					expect(res.uptime).toBe(hb.uptime);
					expect(res.date).toBeDefined();
					return done();
				});
			});
		})
	});

	it('calls observeHeartbeat() and asserts observable returns 2xinserted message', function (done) {
		let s = MongoHeartbeat.fromHeartbeat(hb);

		let obs = MongoHeartbeat.observeHeartbeat(s);
		expect(obs instanceof Observable).toBe(true);
		let i = 0
		obs.subscribe(msg => {
			expect(msg).toContain("inserted");
			i++;
			logger.info("observeHeartBeat() response %d is %s", i, msg);
			if (i == 2) {
				done();
			}
		},
		err => {
			expect(err).toBe("unexpected");
			done();
		});
	});

	it('calls observeHeartbeat() twice and asserts observable returns each 2xinserted message', function (done) {
		let s = MongoHeartbeat.fromHeartbeat(hb);

		let obs = MongoHeartbeat.observeHeartbeat(s);
		expect(obs instanceof Observable).toBe(true);
		let i = 0
		obs.subscribe(msg => {
			expect(msg).toContain("sensor and sensorData inserted");
			i++;
			if (i == 2) {
				s.uptime++;
				var obs2 = MongoHeartbeat.observeHeartbeat(s);
				var i2 = 0;
				obs2.subscribe(msg2 => {
					expect(msg2).toContain("sensorData inserted");
					expect(msg2).not.toContain("sensor and sensorData inserted");
					i2++;
					if (i2 == 2) {
						done();
					}
				},
				err => {
					expect("unexpected error (2) ").toBe(err);
					done();
				});
			}
		},
		err => {
			expect("unexpected error").toBe(err);
			done();
		});
	});

	it('post(full obj) calls observeHeartbeat()', (done) => {

		spyOn(MongoHeartbeat, 'observeHeartbeat');
		hb.post().subscribe(s => {
			expect(MongoHeartbeat.observeHeartbeat).toHaveBeenCalled();
			done();
		})
	});

});

describe("heartbeat model prepopulated tests", function () {
	let insertedId: string;
	beforeEach((done) => {
		hb = getHeartbeatObject();
		hb.deleteAll().subscribe(s => {
			hb.post().subscribe(s => {
				expect(s).toEqual(jasmine.any(String));
				insertedId = s;
				done()
			},
			e => {
				expect(e).toBeUndefined();
				done();
			}
		);
		});
	});

	it('deleteAll', (done) => {
		hb.deleteAll().subscribe(d => {
			expect(d).toEqual(1);
			done();
		})
	});

	it('get by ID', (done) => {
		Heartbeat.getByID(insertedId).subscribe(d => {
			expect(typeof (d)).toBe("object");
			done();
		})
	});

	it('get by ID - NOT FOUND', (done) => {
		hb.deleteAll().subscribe(removed => {
			Heartbeat.getByID(insertedId).subscribe(d => {
				expect("Failed to get an exception").toBe("NOT FOUND");
				done();
			}, err => {
				expect(err.toString()).toBe("NOT FOUND");
				done();
			})
		})
	});

});

