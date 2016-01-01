
var mongoClient = require('mongodb').MongoClient;
var logger = require('./logger');
var util = require('util');
var mongourl = process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/lg';

var connect = function(callback) {
	mongoClient.connect(mongourl, function(err, db) {
		if (err) {
			logger.error('db.js - connection to %s failed', mongourl);
			return callback(err, null);
		} else { 
			logger.info('db.js - connection to %s ok, implemented return as anonymous function', mongourl);
			return callback(null, db);
		}
	});
};

var collections = function(callback) {
	connect(function(err, dbObj) {
		dbObj.collections(function(err, coll) {
			var names = coll.map(function(item) {
				return item.s.name;
			});
			logger.info('collections: %s ', util.inspect(coll));
			logger.info('names: %s ', util.inspect(names));
			callback(null, names);
		});
  })
}
		
module.exports = {	
	connect: connect,
	collections: collections
};

