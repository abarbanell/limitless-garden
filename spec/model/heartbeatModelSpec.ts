import { Heartbeat, MongoHeartbeat } from '../../src/model/model.heartbeat';
import { Observable } from 'rxjs/Rx';

var util = require('util');
var hb: Heartbeat;

var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var colname = db.collectionName('model.heartbeat');
import mongodb = require('mongodb');

function getHeartbeatObject() {
	var hb: Heartbeat = new Heartbeat();
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
		hb.deleteAll().subscribe(s => {
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
			db.connect(function (err, dbObj) {
				var oid = new mongodb.ObjectId.createFromHexString(s)
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
				var oid = new mongodb.ObjectId.createFromHexString(s)
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
});

it('calls observerHeartbeat() and asserts observable returns TODO message', function(done) {
	var s = MongoHeartbeat.fromHeartbeat(hb);

	var obs = MongoHeartbeat.observeHeartbeat(s);
	expect(obs instanceof Observable).toBe(true);
	var i = 0
	obs.subscribe(s => {
		// TODO: should check that we get one message for each of the 2 values
		expect(s).toContain("TODO: ");
		i++;
		if (i == 2) {
			done();			
		}
	});
});

it('post(full obj) calls observeHeartbeat()', (done) => {

	spyOn(MongoHeartbeat, 'observeHeartbeat');
	hb.post().subscribe(s => {
		expect(MongoHeartbeat.observeHeartbeat).toHaveBeenCalled();
		done();
	})
});


describe("heartbeat model prepopulated tests", function () {
	var insertedId: string;
	beforeEach((done) => {
		hb = new Heartbeat();
		hb.deleteAll().subscribe(s => {
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
		Heartbeat.getByID(insertedId).subscribe(d => {
			expect(typeof(d)).toBe("object");
			done();
		})
	});

	it('get by ID - NOT FOUND', (done) => {
		var hb = new Heartbeat();
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

