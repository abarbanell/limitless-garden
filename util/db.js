
var mongoClient = require('mongodb').MongoClient;
var logger = require('./logger');
var mongourl = process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/lg';

module.exports = function(callback) {
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
		

