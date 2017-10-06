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
var Value = /** @class */ (function () {
    function Value() {
    }
    return Value;
}());
exports.Value = Value;
var HeartbeatPayload = /** @class */ (function () {
    function HeartbeatPayload() {
    }
    return HeartbeatPayload;
}());
exports.HeartbeatPayload = HeartbeatPayload;
var MongoHeartbeat = /** @class */ (function (_super) {
    __extends(MongoHeartbeat, _super);
    function MongoHeartbeat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MongoHeartbeat.prototype.fromHeartBeat = function (hb) {
        if (hb._id) {
            this._id = new mongodb.ObjectId.createFromHexString(hb._id);
        }
        this.host = hb.host || "UNKNOWN";
        if (hb.uptime) {
            this.uptime = hb.uptime;
        }
        if (hb.i2cDevices) {
            this.i2cDevices = hb.i2cDevices;
        }
        this.date = hb.date || new Date();
        this.values = hb.values || [];
        logger.info("Mongo object: %s", util.inspect(this));
        return this;
    };
    return MongoHeartbeat;
}(HeartbeatPayload));
exports.MongoHeartbeat = MongoHeartbeat;
// class SensorClass  implements ISensor { 
//   _id: string = null;
//   name: string = null;
//   host: string = null;
//   type = { name: null };
//   constructor(host: string, type: string) {
//     this.host = host;
//     this.type.name = type;
//   }
// }
var Heartbeat = /** @class */ (function (_super) {
    __extends(Heartbeat, _super);
    function Heartbeat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heartbeat.prototype.post = function () {
        var mongoObject = new MongoHeartbeat().fromHeartBeat(this);
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
                    obs.next(results.ops[0]._id.toString());
                    // now process results - fire and forget...
                    Heartbeat._pubsub.next(mongoObject);
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
                        logger.error("Heartbeat.deleteAll.delete error: ", e);
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
    // private mongofy(): MongoHeartbeat  {
    //   var rc: any = {};
    //   if (this._id) {
    //     rc._id = new mongodb.ObjectId.createFromHexString(this._id)
    //   }
    //   rc.host = this.host || "UNKNOWN";
    //   if (this.uptime) { 
    //     rc.uptime = this.uptime
    //   }
    //   if (this.i2cDevices) { 
    //     rc.i2cDevices = this.i2cDevices
    //   }
    //   rc.date = this.date ||  new Date().toISOString()
    //   logger.info("Mongo object: %s", util.inspect(rc))
    //   return rc;
    // }
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
    Heartbeat.sub = Heartbeat._pubsub.subscribe(function (s) {
        var host = s.host;
        var sensor = new model_sensor_1.SensorModel();
        for (var _i = 0, _a = s.values; _i < _a.length; _i++) {
            var value = _a[_i];
            logger.error("TODO: insert or update sensor %s for host %s", value.type, host);
        }
    });
    Heartbeat._collectionName = db.collectionName('model.heartbeat');
    return Heartbeat;
}(HeartbeatPayload));
exports.Heartbeat = Heartbeat;
