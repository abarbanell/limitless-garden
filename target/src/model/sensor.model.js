"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require('../util/logger');
var db = require('../util/db');
var mongodb = require("mongodb");
var Rx_1 = require("rxjs/Rx");
var SensorModel = (function () {
    function SensorModel() {
        this._schema_version = 1;
        this._collectionName = db.collectionName('model.sensor');
    }
    SensorModel.prototype.get = function () {
        var cn = this._collectionName;
        var obs = new Rx_1.Subject();
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.find({ schema_version: 1 }).toArray().then(function (docs) {
                    obs.next(docs);
                });
            }
            catch (ex) {
                logger.error("SensorModel.get.catch: ", ex);
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.getById = function (id) {
        var cn = this._collectionName;
        var obs = new Rx_1.Subject();
        logger.info("SensorModel.getById before mongo call");
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
                logger.error("SensorModel.getById.catch: ", ex);
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.post = function (data) {
        var id = "error";
        var ms = new MongoSensorClass(data);
        var obs = new Rx_1.Subject();
        var cn = this._collectionName;
        logger.info("SensorModel.post before mongo call");
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            coll.insert(ms, {}, function (e, results) {
                if (e)
                    obs.error(e);
                if (results) {
                    obs.next(results.ops[0]._id.toString());
                }
            });
        });
        return obs.asObservable();
    };
    SensorModel.prototype.delete = function (id) {
        var cn = this._collectionName;
        var obs = new Rx_1.Subject();
        logger.info("SensorModel.delete before mongo call");
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                var oid = mongodb.ObjectID.createFromHexString(id);
                coll.deleteOne({ _id: oid }, function (e, results) {
                    if (e) {
                        logger.error("SensorModel.delete.delete error: ", e);
                        obs.error(e);
                    }
                    if (results) {
                        logger.error('SensorModel.delete.delete results: ', results.deletedCount);
                        obs.next(results.deletedCount);
                    }
                });
            }
            catch (ex) {
                logger.error("SensorModel.delete.catch: ", ex);
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.deleteAll = function () {
        var cn = this._collectionName;
        var obs = new Rx_1.Subject();
        logger.info("SensorModel.deleteAll before mongo call");
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.deleteOne({}, function (e, results) {
                    if (e) {
                        logger.error("SensorModel.deleteAll.delete error: ", e);
                        obs.error(e);
                    }
                    if (results) {
                        logger.info('SensorModel.deleteAll.delete results: ', results.deletedCount);
                        obs.next(results.deletedCount);
                    }
                });
            }
            catch (ex) {
                logger.error("SensorModel.deleteAll.catch: ", ex);
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    SensorModel.prototype.getCollectionName = function () {
        return this._collectionName;
    };
    SensorModel.prototype.getByHost = function (host) {
        var cn = this._collectionName;
        var obs = new Rx_1.Subject();
        logger.info("SensorModel.getByHost before mongo call");
        db.connect(function (err, dbObj) {
            var coll = dbObj.collection(cn);
            try {
                coll.find({ host: host }, {}, function (e, results) {
                    if (e) {
                        logger.error("SensorModel.getByhost.find: ", e);
                        obs.error(e);
                    }
                    if (results) {
                        obs.next(results);
                    }
                });
            }
            catch (ex) {
                logger.error("SensorModel.getByHost.catch: ", ex);
                obs.error(ex);
            }
        });
        return obs.asObservable();
    };
    return SensorModel;
}());
exports.SensorModel = SensorModel;
var MongoSensorClass = (function () {
    function MongoSensorClass(is) {
        this._id = null;
        this.schema_version = 1;
        this.name = null;
        this.host = null;
        this.type = { name: null };
        if (is._id) {
            this._id = new mongodb.ObjectId.createFromHexString(is._id);
        }
        this.name = is.name;
        this.host = is.host;
        this.type = is.type;
    }
    return MongoSensorClass;
}());
