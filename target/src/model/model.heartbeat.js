"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var mongodb = require("mongodb");
var util = require("util");
var logger = require('../util/logger');
var db = require('../util/db');
var statsd_1 = require("../util/statsd");
var model_sensor_1 = require("./model.sensor");
var Value = (function () {
    function Value() {
    }
    return Value;
}());
exports.Value = Value;
var HeartbeatPayload = (function () {
    function HeartbeatPayload() {
    }
    return HeartbeatPayload;
}());
exports.HeartbeatPayload = HeartbeatPayload;
var MongoHeartbeat = (function (_super) {
    __extends(MongoHeartbeat, _super);
    function MongoHeartbeat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MongoHeartbeat.fromHeartbeat = function (hb) {
        var mhb = new MongoHeartbeat();
        if (hb._id) {
            mhb._id = new mongodb.ObjectId.createFromHexString(hb._id);
        }
        mhb.host = hb.host || "UNKNOWN";
        if (hb.uptime) {
            mhb.uptime = hb.uptime;
        }
        if (hb.i2cDevices) {
            mhb.i2cDevices = hb.i2cDevices;
        }
        mhb.date = hb.date || new Date();
        mhb.values = hb.values || [];
        logger.info("Mongo object: %s", util.inspect(mhb));
        return mhb;
    };
    MongoHeartbeat.observeHeartbeat = function (s) {
        var obs = new Rx_1.Subject();
        var host = s.host;
        var sensor = model_sensor_1.SensorModel.getInstance();
        var _loop_1 = function () {
            logger.error("observeHeartbeat() - value to insert: %s", util.inspect(value));
            // problem is var (global scope) vs let (local scope) - should be fine now...
            var pattern = new model_sensor_1.Sensor();
            pattern.host = host;
            pattern.type = value.type;
            logger.error("observeHeartbeat() - going to find existing sensor pattern: %s", util.inspect(pattern));
            sensor.find(pattern).subscribe(function (d) {
                logger.error("observeHeartbeat() - find existing sensor pattern: %s - found entries %s", util.inspect(pattern), util.inspect(d));
                if (d.length == 0) {
                    sensor.post(pattern).subscribe(function (id) {
                        sensor.postData(id, host, value.type, value.val).subscribe(function (rc) {
                            obs.next("observeHeartbeat() - sensor and sensorData inserted with sensor id " + id
                                + " for value " + value.type + " for host " + host);
                        });
                    });
                }
                if (d.length == 1) {
                    logger.error("observeHeartbeat() - sensorData trying to insert with sensor id " + d[0]._id);
                    sensor.postData(d[0]._id, host, value.type, value.val).subscribe(function (rc) {
                        obs.next("observeHeartBeat() - sensorData inserted with sensor id " + d[0]._id
                            + " for value " + value.type + " for host " + host);
                    }, function (err) {
                        var msg = "observeHeartbeat() - could not post with sensor id " + d[0]._id;
                        logger.error(msg);
                        obs.error(msg);
                    });
                }
                if (d.length > 1) {
                    logger.error("duplicate sensor: " + util.inspect(d));
                    obs.error("TODO: handle duplicate sensor on same host for value " + value.type + " for host " + host);
                }
            });
        };
        for (var _i = 0, _a = s.values; _i < _a.length; _i++) {
            var value = _a[_i];
            _loop_1();
        }
        return obs.asObservable();
    };
    return MongoHeartbeat;
}(HeartbeatPayload));
exports.MongoHeartbeat = MongoHeartbeat;
var Heartbeat = (function (_super) {
    __extends(Heartbeat, _super);
    function Heartbeat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heartbeat.prototype.post = function () {
        var mongoObject = MongoHeartbeat.fromHeartbeat(this);
        var obs = new Rx_1.Subject();
        if (this.host && this.uptime) {
            statsd_1.statsdHeartbeat(this.host, this.uptime);
        }
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(Heartbeat._collectionName);
            coll.insert(mongoObject, {}, function (e, results) {
                if (e)
                    obs.error(e);
                if (results) {
                    // now process results - we do not subscribe to the 
                    // results, just fire & forget
                    MongoHeartbeat.observeHeartbeat(mongoObject);
                    // we send back the id of the Heartbeat object in the DB
                    obs.next(results.ops[0]._id.toString());
                }
            });
        });
        return obs.asObservable();
    };
    Heartbeat.getByID = function (id) {
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(Heartbeat._collectionName);
            var objId = mongodb.ObjectId.createFromHexString(id);
            coll.findOne({ _id: objId }, function (e, results) {
                if (e)
                    obs.error(e);
                if (results) {
                    var hb = new Heartbeat();
                    hb.populate(results);
                    obs.next(hb);
                }
                else {
                    obs.error("NOT FOUND");
                }
            });
        });
        return obs.asObservable();
    };
    Heartbeat.prototype.deleteAll = function () {
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(Heartbeat._collectionName);
            try {
                coll.deleteMany({}, function (e, results) {
                    if (e) {
                        obs.error(e);
                    }
                    if (results) {
                        obs.next(results.deletedCount);
                    }
                });
            }
            catch (ex) {
                logger.error("Heartbeat.deleteAll.catch: ", ex);
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    Heartbeat.prototype.populate = function (obj) {
        if (obj.host) {
            this.host = obj.host;
        }
        if (obj.uptime && (typeof (obj.uptime == 'number'))) {
            this.uptime = obj.uptime;
        }
        if (obj.i2cDevices && (typeof (obj.i2cDevices == 'number'))) {
            this.i2cDevices = obj.i2cDevices;
        }
        if (obj.values) {
            this.values = obj.values;
        }
        return this;
    };
    Heartbeat._pubsub = new Rx_1.Subject();
    Heartbeat.sub = Heartbeat._pubsub.subscribe(MongoHeartbeat.observeHeartbeat);
    Heartbeat._collectionName = db.collectionName('model.heartbeat');
    return Heartbeat;
}(HeartbeatPayload));
exports.Heartbeat = Heartbeat;
//# sourceMappingURL=model.heartbeat.js.map