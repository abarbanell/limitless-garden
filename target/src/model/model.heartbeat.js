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
var Heartbeat = (function (_super) {
    __extends(Heartbeat, _super);
    function Heartbeat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // constructor() {
        //   super();
        //   Heartbeat._pubsub.subscribe(s => {
        //     log.error("pubsub event: %s", util.inspect(s));
        //   })
        // }
        _this._collectionName = db.collectionName('model.heartbeat');
        return _this;
    }
    //private dataPosted = new Subject<mongoObject>();
    Heartbeat.prototype.post = function () {
        var mongoObject = new MongoHeartbeat().fromHeartBeat(this);
        var obs = new Rx_1.Subject();
        var cn = this._collectionName;
        if (this.host && this.uptime) {
            statsd_1.statsdHeartbeat(this.host, this.uptime);
        }
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
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
    return Heartbeat;
}(HeartbeatPayload));
exports.Heartbeat = Heartbeat;
