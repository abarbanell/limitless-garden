var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';

var sensor = function() { 

	var get = function(id, callback) {
		db.collection(colname).findOne({"_id": id}, callback);
	};

	var getMulti = function(base, count, callback) {
		
		var baseobj = {};
		if (base) {
			baseobj._id = { $gte: base };
		}
		db.collection(colname).find(baseobj, null, {
			limit: count
		}).toArray(callback);
		//{ 
		//	"_id": { $gte: base }
		//}, null,  { 
		//	limit: count, 
		//	sort: { 
		//		"_id": 1 
		//	}
		//}, function (err, resultCursor) {
		//	logger.info('getMulti mongo query result: ' + JSON.stringify(resultCursor));
		//	resultCursor.toArray(callback);
		//});
	};
	
	var getUniqueHosts = function(callback) {
		db.collection(colname).distinct("host", callback);
	};

	return {
		get: get,
		getMulti: getMulti,
		getUniqueHosts: getUniqueHosts
	}
}();

module.exports = sensor; 
