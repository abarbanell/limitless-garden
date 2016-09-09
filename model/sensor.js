var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';

var sensor = function() { 

	// validate object returned from DB. should never leak inconsitent objects
	var validateObj = function(obj) {
		// a null obj yields a null.
		if (! obj) return null;
		var rObj = {}; 
		rObj._id = obj._id;
		//rename some fields
		logger.info('typeof(timestamp) = ' + typeof(obj.timestamp));
		logger.info('typeof(timespamp) = ' + typeof(obj.timespamp));
		if(obj.timestamp) {
			if (typeof(obj.timestamp) == 'number') { // UNIX timestamp
				var date = new Date(obj.timestamp * 1000)
				rObj.date = date.toJSON();
			} else { 
				var date = new Date(obj.timestamp);
				rObj.date = date.toJSON();
			}   
		}   
		rObj.value = obj.soil;
		// copy some fields
		rObj.host = obj.host;
		// sensor MUST be an array of strings
		rObj.sensor = [];
		if (Array.isArray(obj.sensor)) { 
			for (val in obj.sensor) {
				if (typeof(val) == 'string') {
					rObj.sensor.push(val);
				} else { 
					logger.error('model/sensor.js validateObj: sensor contains non-string value: ' + util.inspect(val));
				}
			}
		} else {
			logger.error('model/sensor.js validateObj: sensor is not an array: ' + util.inspect(val));
		}
		// ignore all other fields and return
		return rObj;
	}; 

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
				if (err) {
					return callback(err,null);
				} else {
					var vObj = validateObj(doc);
					return callback(err,vObj);
				}
			});
		});
	};

	var find = function(query, options, callback) {
		logger.info('sensor.js - converting results toArray()');
		db.connect(function(err,dbObj){
			var collection = dbObj.collection(colname);
			collection.find(query, options).toArray(function(err,docs){
				dbObj.close();
				var mapped = docs.map(validateObj);
				callback(err,mapped);
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

	return {
		get: findOne,
		getMulti: find,
		getUniqueHosts: distinctHosts,
		getValuesByHost: findValuesByHost,
		validateObj: validateObj
	}
}();

module.exports = sensor; 
