"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require('../util/logger');
var db = require('../util/db');
var mongodb = require("mongodb");
var Rx_1 = require("rxjs/Rx");
var util = require("util");
var SensorModel = /** @class */ (function () {
    function SensorModel() {
        this._schema_version = 1;
        this.createIndex();
    }
    SensorModel.prototype.createIndex = function () {
        logger.error("model.sensor.createIndex - called");
        var options = { unique: true, background: true, w: 1 };
        db.connect(function (err, dbObj) {
            var collection = dbObj.collection(SensorModel._collectionName);
            // delete all - remove this later...
            collection.deleteMany({}, function (e, results) {
                collection.createIndex({ name: 1 }, options, function (err, indexName) {
                    logger.error("model.sensor.createIndex - callback");
                    if (err) {
                        logger.error("model.sensor.createIndex - error: %s", err);
                    }
                    if (indexName) {
                        SensorModel._indexName = indexName;
                        logger.error("model.sensor.createIndex - indexName: %s", util.inspect(indexName));
                    }
                });
            });
        });
        logger.error("model.sensor.createIndex - return(void)");
    };
    SensorModel.getInstance = function () {
        if (SensorModel._instance == null) {
            SensorModel._instance = new SensorModel();
        }
        return SensorModel._instance;
    };
    SensorModel.prototype.get = function () {
        var cn = SensorModel._collectionName;
        var obs = new Rx_1.Subject();
        var sv = this._schema_version;
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.find({ schema_version: sv }).toArray().then(function (docs) {
                    obs.next(docs);
                });
            }
            catch (ex) {
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.getById = function (id) {
        var cn = SensorModel._collectionName;
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                var oid = mongodb.ObjectID.createFromHexString(id);
                coll.findOne({ _id: oid }, {}, function (e, results) {
                    if (e) {
                        logger.error("SensorModel.getById.findOne: ", e);
                        obs.error(e);
                    }
                    if (results && results._id) {
                        if (results._id instanceof mongodb.ObjectID) {
                            results._id = results._id.toString();
                        }
                    }
                    obs.next(results);
                });
            }
            catch (ex) {
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.post = function (data) {
        var id = "error";
        if (!data.name) {
            data.name = data.host + "." + data.type;
            logger.error("sensor.post(): name set to %s", data.name);
        }
        var ms = new MongoSensorClass(data);
        var obs = new Rx_1.Subject();
        var cn = SensorModel._collectionName;
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.insert(ms, {}, function (e, results) {
                    if (e) {
                        return obs.error("insert error: " + e);
                    }
                    if (results) {
                        return obs.next(results.ops[0]._id.toString());
                    }
                });
            }
            catch (ex) {
                obs.error("exception: " + ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.postData = function (sensorId, host, type, val) {
        var obs = new Rx_1.Subject();
        var mongoSensorId;
        try {
            logger.error("sensor.postData() - try to convert to ObjectID: " + sensorId);
            mongoSensorId = mongodb.ObjectID.createFromHexString(sensorId.toString());
            db.connect(function (err, dbObj) {
                var coll = dbObj.collection(SensorModel._dataCollectionName);
                coll.insert({
                    sensorId: mongoSensorId,
                    host: host,
                    type: type,
                    val: val
                }, {}, function (e, results) {
                    if (e) {
                        var msg = e.toString();
                        logger.error(msg);
                        obs.error(msg);
                    }
                    if (results) {
                        obs.next(results.ops[0]._id.toString());
                    }
                });
            });
        }
        catch (e) {
            logger.error("sensor.postData() - could not convert to ObjectID: %s, error: %s", sensorId, e.toString());
            obs.error(e.toString());
        }
        return obs.asObservable();
    };
    ;
    SensorModel.prototype.delete = function (id) {
        var cn = SensorModel._collectionName;
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                var oid = mongodb.ObjectID.createFromHexString(id);
                coll.deleteOne({ _id: oid }, function (e, results) {
                    if (e) {
                        obs.error(e);
                    }
                    if (results) {
                        obs.next(results.deletedCount);
                    }
                });
            }
            catch (ex) {
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.deleteAll = function () {
        var cn = SensorModel._collectionName;
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
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
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.getCollectionName = function () {
        return SensorModel._collectionName;
    };
    SensorModel.prototype.getByHost = function (host) {
        var cn = SensorModel._collectionName;
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.find({ host: host }, {}, function (e, results) {
                    if (e) {
                        obs.error(e);
                    }
                    results.toArray(function (err, docs) {
                        obs.next(docs);
                    });
                });
            }
            catch (ex) {
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.find = function (pattern) {
        var cn = SensorModel._collectionName;
        var obs = new Rx_1.Subject();
        var mpattern = this.mongofy(pattern);
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.find(mpattern, {}, function (e, results) {
                    if (e) {
                        obs.error(e);
                    }
                    results.toArray(function (err, docs) {
                        obs.next(docs);
                    });
                });
            }
            catch (ex) {
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.mongofy = function (s) {
        var lrc = {};
        if (s._id) {
            lrc._id = new mongodb.ObjectId.createFromHexString(s._id);
        }
        if (s.host) {
            lrc.host = s.host;
        }
        if (s.name) {
            lrc.name = s.name;
        }
        if (s.type) {
            lrc.type = s.type;
        }
        return lrc;
    };
    SensorModel._collectionName = db.collectionName('model.sensor');
    SensorModel._dataCollectionName = db.collectionName('model.sensorData');
    SensorModel._instance = null;
    SensorModel._indexName = null;
    return SensorModel;
}());
exports.SensorModel = SensorModel;
var Sensor = /** @class */ (function () {
    function Sensor() {
    }
    return Sensor;
}());
exports.Sensor = Sensor;
var MongoSensorClass = /** @class */ (function () {
    function MongoSensorClass(is) {
        this._id = null;
        this.schema_version = 1;
        this.name = null;
        this.host = null;
        this.type = null;
        if (is._id) {
            this._id = new mongodb.ObjectId.createFromHexString(is._id);
        }
        this.name = is.name;
        this.host = is.host;
        this.type = is.type;
    }
    return MongoSensorClass;
}());
