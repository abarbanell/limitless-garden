var mongoClient = require('mongodb').MongoClient;
var logger = require('./logger');
var util = require('util');
var mongourl = process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/lg';
var env = process.env.ENVIRONMENT || 'dev';
var connect = function (callback) {
    mongoClient.connect(mongourl, function (err, db) {
        if (err) {
            logger.error('db.js - connection to %s failed', mongourl);
            return callback(err, null);
        }
        else {
            logger.info('db.js - connection to %s ok, implemented return as anonymous function', mongourl);
            return callback(null, db);
        }
    });
};
var collections = function (callback) {
    connect(function (err, dbObj) {
        dbObj.collections(function (err, coll) {
            var names = coll
                .filter(function (value) {
                return (value.s.name.startsWith(env) && (value.s.name.length > env.length));
                ;
            })
                .map(function (item) {
                var n = item.s.name.substring(env.length + 1);
                return n;
            });
            logger.info('collections: %s ', util.inspect(coll));
            logger.info('names: %s ', util.inspect(names));
            callback(null, names);
        });
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
