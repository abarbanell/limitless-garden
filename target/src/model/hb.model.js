"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var mongodb = require("mongodb");
var logger = require('../util/logger');
var db = require('../util/db');
var statsd_1 = require("../util/statsd");
var Heartbeat = (function () {
    function Heartbeat() {
        this._collectionName = db.collectionName('model.heartbeat');
    }
    Heartbeat.prototype.post = function () {
        // var id: string = "error";
        var mongoObject = this.mongofy();
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
                }
            });
        });
        return obs.asObservable();
    };
    Heartbeat.prototype.mongofy = function () {
        var rc = {};
        if (this._id) {
            rc._id = new mongodb.ObjectId.createFromHexString(this._id);
        }
        if (this.host) {
            rc.host = this.host;
        }
        if (this.uptime) {
            rc.host = this.uptime;
        }
        if (this.i2cDevices) {
            rc.host = this.i2cDevices;
        }
        if (this.date) {
            rc.host = this.date;
        }
        else {
            rc.host = new Date().toISOString();
        }
        logger.info("Mongo object: %s", rc);
        return rc;
    };
    Heartbeat.prototype.populate = function (obj) {
        if (obj.host) {
            this.host = obj.host;
        }
        if (obj.uptime && (typeof (obj.uptime == 'number'))) {
            this.uptime = obj.uptime;
        }
    };
    return Heartbeat;
}());
exports.Heartbeat = Heartbeat;