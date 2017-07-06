var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.plant';

var check = function(obj) {
	var lObj = {};
	lObj.name = obj.name || "unknown";
	lObj.species = obj.species || "unknown";
	lObj.location = obj.location || "unknown";
	return lObj;
}

var plant = function() { 

	var create = function(obj, callback) {
		var lObj = check(obj);
		db.connect(function(err,dbObj){
			if (err) { 
				logger.error("plant.js - could not open db: %s", err);
				return callback(err, null);
			}
			logger.info('plant.js - db opened');
			var collection = dbObj.collection(colname);
			var lrc = collection.insert(lObj);
			return callback(err, lrc);
		});
	};

	var findOne = function(id, callback) {
		logger.info('plant.js - called with id=%s for collection=%s', id, colname);
		db.connect(function(err, dbObj){
			if (err) {
				logger.error('plant.js - could not open db: %s', err);
				return callback(err, null);
			}
			logger.info('plant.js - db opened');
			var collection = dbObj.collection(colname);
			collection.findOne({"_id": id}, {}, function(err,doc) {
				dbObj.close();
				logger.info('plant.js - db closed');
				return callback(err,doc);
			});
		});
	};

	var find = function(query, options, callback) {
		logger.info('plant.js - converting results toArray()');
		db.connect(function(err,dbObj){
			var collection = dbObj.collection(colname);
			collection.find(query, options).toArray(function(err,docs){
				dbObj.close();
				callback(err,docs);
			});
		});
	};

	var distinctSpecies = function(callback) {
		db.connect(function(err,dbObj){
			dbObj.collection(colname).distinct("species", function(err,result){
				dbObj.close();
				return callback(err,result);
			});
		});
	};

	return {
		create: create,
		get: findOne,
		getMulti: find,
		getSpecies: distinctSpecies
	}
}();

module.exports = plant; 
