var logger = require('../util/logger');
var db = require('../util/db');
var colname = process.env.ENVIRONMENT + '.sensor';

var sensor = function() { 

	var get = function(id, callback) {
		db.collection(colname).findOne({"_id": id}, callback);
	};

	var getMulti = function(base, count, callback) {
		db.collection(colname).find({ 
			"_id": { $gte: base }
		}, null, { 
			limit: count, 
			sort: { 
				"_id": 1 
			}
		}, function (err, resultCursor) {
			resultCursor.toArray(callback);
		});
	};

	return {
		get: get,
		getMulti: getMulti
	}
}();

module.exports = sensor; 
