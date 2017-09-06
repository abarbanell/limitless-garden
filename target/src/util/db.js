var mongoClient = require('mongodb').MongoClient;
var logger = require('./logger');
var util = require('util');
var mongourl = process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/lg';
var env = process.env.ENVIRONMENT || 'dev';
var _db = null;
var connect = function (callback) {
    if (_db) {
        logger.info('db.ts - connection to %s reused: %s', mongourl, _db);
        return callback(null, _db);
    }
    else {
        mongoClient.connect(mongourl, function (err, db) {
            if (err || !db) {
                logger.error('db.ts - connection to %s failed', mongourl);
                return callback(err, null);
            }
            logger.info('db.ts - connection to %s ok', mongourl);
            _db = db;
            return callback(null, _db);
        });
    }
};
var collections = function (callback) {
    connect(function (err, dbObj) {
        if (err || !dbObj) {
            return callback(err, null);
        }
        else {
            dbObj.collections(function (err, coll) {
                if (err || !coll) {
                    return callback(err, null);
                }
                else {
                    var names = coll
                        .filter(function (value) {
                        return (value.s.name.startsWith(env) && (value.s.name.length > env.length));
                        ;
                    })
                        .map(function (item) {
                        var n = item.s.name.substring(env.length + 1);
                        return n;
                    });
                    logger.info('names: %s ', util.inspect(names));
                    return callback(null, names);
                }
            });
        }
    });
};
var count = function (name, callback) {
    connect(function (err, db) {
        if (err)
            return callback(err, null);
        return callback(null, 0);
    });
};
var collectionName = function (n) {
    return env + '.' + n;
};
module.exports = {
    connect: connect,
    collections: collections,
    count: count,
    collectionName: collectionName
};
