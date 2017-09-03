"use strict";
var logger = require('../util/logger');
var util = require('util');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var sensor = function () {
    // validate object returned from DB. should never leak inconsitent objects
    var validateObj = function (obj) {
        // a null obj yields a null.
        if (!obj)
            return null;
        var rObj = {};
        rObj._id = obj._id;
        // check version schema_version should be 0 or non-existing
        if (obj.schema_version) {
            logger.error('model/sensor.js: did not expect record with schema_version = ' +
                obj.schema_version);
        }
        //rename some fields
        logger.info('typeof(timestamp) = ' + typeof (obj.timestamp));
        logger.info('typeof(timespamp) = ' + typeof (obj.timespamp));
        if (obj.timestamp) {
            if (typeof (obj.timestamp) == 'number') {
                var date = new Date(obj.timestamp * 1000);
                rObj.date = date.toJSON();
            }
            else {
                var date = new Date(obj.timestamp);
                rObj.date = date.toJSON();
            }
        }
        rObj.value = obj.soil;
        // copy some fields
        rObj.host = obj.host;
        // sensor MUST be an array of strings
        rObj.sensor = [];
        logger.info('obj.sensor = ' + util.inspect(obj.sensor));
        if (Array.isArray(obj.sensor)) {
            for (var i = 0; i < obj.sensor.length; i++) {
                if (typeof (obj.sensor[i]) == 'string') {
                    logger.info('obj.sensor[i] = ' + util.inspect(obj.sensor[i]));
                    rObj.sensor.push(obj.sensor[i]);
                }
                else {
                    logger.error('model/sensor.js validateObj: sensor contains non-string value: ' + util.inspect(obj.sensor[i]));
                }
            }
        }
        else {
            logger.error('model/sensor.js validateObj: sensor is not an array: ' + util.inspect(obj.sensor));
        }
        // ignore all other fields and return
        return rObj;
    };
    var findOne = function (id, callback) {
        logger.info('sensor.js - called with id=%s for collection=%s', id, colname);
        db.connect(function (err, dbObj) {
            if (err) {
                logger.error('sensor.js - could not open db: %s', err);
                return callback(err, null);
            }
            logger.info('sensor.js - db opened');
            var collection = dbObj.collection(colname);
            collection.findOne({
                "_id": id,
                "schema_version": { "$exists": false }
            }, {}, function (err, doc) {
                if (err) {
                    return callback(err, null);
                }
                else {
                    var vObj = validateObj(doc);
                    return callback(err, vObj);
                }
            });
        });
    };
    var find = function (query, options, callback) {
        logger.info('sensor.js - converting results toArray()');
        query.schema_version = { "$exists": false };
        db.connect(function (err, dbObj) {
            var collection = dbObj.collection(colname);
            collection.find(query, options).toArray(function (err, docs) {
                var mapped = docs.map(validateObj);
                callback(err, mapped);
            });
        });
    };
    var distinctHosts = function (callback) {
        db.connect(function (err, dbObj) {
            dbObj.collection(colname).distinct("host", function (err, result) {
                return callback(err, result);
            });
        });
    };
    var findValuesByHost = function (host, value, callback) {
        logger.info('model/sensor.js - findValuesByHost, host: ' + host + ', value: ' + value);
        db.connect(function (err, dbObj) {
            if (err) {
                logger.error('model/sensor.js - db.connect() err: ' + err);
            }
            var collection = dbObj.collection(colname);
            var query = {};
            query['host'] = host;
            query[value] = { $gt: 0 };
            query.schema_version = { "$exists": false };
            var options = {};
            options['host'] = 1;
            options[value] = 1;
            options['timestamp'] = 1;
            collection.find(query, options).toArray(function (err, docs) {
                if (err) {
                    logger.error('model/sensor.js - collection.find() err: ' + err);
                }
                dbObj.close();
                callback(err, docs);
            });
        });
    };
    return {
        // v0 - these do NOT have a schema_version field
        get: findOne,
        getMulti: find,
        getUniqueHosts: distinctHosts,
        getValuesByHost: findValuesByHost,
        validateObj: validateObj
        // v1 - these have schema_version: 1
        // TODO
    };
}();
module.exports = sensor;
