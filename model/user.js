var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = 'sys.' + env + '.user';

var user = function() { 

	var get = function(id, callback) {
		db.collection(colname).findOne({"_id": id}, callback);
	};

var findOrCreate = function(obj, callback) {
	logger.info('findOrCreate obj: ' + JSON.stringify(obj));
	var userObj = { "googleId": obj.profile.id, "displayName": obj.profile.displayName,
		"name": obj.profile.name };
	db.collection(colname).findOne( { "googleId": userObj.googleId }, function(err, result) {
		if (err) {
			logger.error('find user err: ' + err);
			callback(err, null);
		}
		if (result) {
			// found
			logger.info('found user result: ' + JSON.stringify(result));
			callback(null, result);
		} else {
			// not found - create new
			db.collection(colname).insert(userObj, function(err, result) {
				if (err) {
					logger.error('create user err: ' + err);
					callback(err, null);
				}			
				// created
				logger.info('create user result: ' + JSON.stringify(result));
				callback(null, result.ops[0]);
			});
		}
	})
}
	return {
		get: get,
		findOrCreate: findOrCreate
	}
}();

module.exports = user; 