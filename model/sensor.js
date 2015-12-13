var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';

var sensor = function() { 

	var findOne = function(id, callback) {
		logger.info('sensor.js - called with id=%s for collection=%s', id, colname);
		db(function(err, dbObj){
			if (err) {
				logger.error('sensor.js - could not open db: %s', err);
				return callback(err, null);
			}
			logger.info('sensor.js - db opened');
			var collection = dbObj.collection(colname);
			collection.findOne({"_id": id}, {}, function(err,doc) {
				dbObj.close();
				logger.info('sensor.js - db closed');
				return callback(err,doc);
			});
		});
	};

	var find = function(query, options, callback) {
		logger.info('sensor.js - converting results toArray()');
		db(function(err,dbObj){
			var collection = dbObj.collection(colname);
			collection.find(query, options).toArray(function(err,docs){
				dbObj.close();
				callback(err,docs);
			});
		});
	};
	
	var distinctHosts = function(callback) {
		db(function(err,dbObj){
			dbObj.collection(colname).distinct("host", function(err,result){
				dbObj.close();
				return callback(err,result);
			});
		});
	};

	return {
		get: findOne,
		getMulti: find,
		getUniqueHosts: distinctHosts
	}
}();

module.exports = sensor; 
