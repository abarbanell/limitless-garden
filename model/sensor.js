var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';

var sensor = function() { 

	var findOne = function(id, callback) {
		logger.info('sensor.js - called with id=%s for collection=%s', id, colname);
		db.connect(function(err, dbObj){
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
		db.connect(function(err,dbObj){
			var collection = dbObj.collection(colname);
			collection.find(query, options).toArray(function(err,docs){
				dbObj.close();
				callback(err,docs);
			});
		});
	};

	var distinctHosts = function(callback) {
		db.connect(function(err,dbObj){
			dbObj.collection(colname).distinct("host", function(err,result){
				dbObj.close();
				return callback(err,result);
			});
		});
	};


	var findValuesByHost = function(host, value, callback) {
		logger.info('model/sensor.js - findValuesByHost, host: ' + host + ', value: ' + value);
		db.connect(function(err,dbObj){
			if (err) {
				logger.error('model/sensor.js - db.connect() err: ' + err);
			}
			var collection = dbObj.collection(colname);
			var query = { };
			query['host'] = host;
			query[value] = { $gt: 0 };
			var options = {};
			options['host'] = 1;
			options[value] = 1;
			options['timestamp'] = 1;
			collection.find(query, options).toArray(function(err,docs){
				if (err) {
					logger.error('model/sensor.js - collection.find() err: ' + err);
				}
				dbObj.close();
				callback(err,docs);
			});
		});
	}

// Obsolete...
	var findSoilByHost = function(host, callback) {
		db.connect(function(err,dbObj){
			var collection = dbObj.collection(colname);
			var query = { host: host, soil: { $gt: 0 } };
			var options = {host: 1, soil: 1, timestamp: 1};
			collection.find(query, options).toArray(function(err,docs){
				dbObj.close();
				callback(err,docs);
			});
		});
	}

	return {
		get: findOne,
		getMulti: find,
		getUniqueHosts: distinctHosts,
		getSoilByHost: findSoilByHost,
		getValuesByHost: findValuesByHost
	}
}();

module.exports = sensor; 
