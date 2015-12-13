var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = 'sys.' + env + '.user';

var user = function() { 

	var get = function(id, callback) {
		db(function(err,dbObjj){
			dbObj.collection(colname).findOne({"_id": id}, {}, function(err,doc){
				dbObj.close();
				return callback(err,doc);
			});
		});
	};

var findOrCreate = function(obj, callback) {
	logger.info('findOrCreate obj: ' + JSON.stringify(obj));
	var userObj = { "googleId": obj.profile.id, "displayName": obj.profile.displayName,
		"name": obj.profile.name };
	db(function(err,dbObj) {
		dbObj.collection(colname).findOne( { "googleId": userObj.googleId }, {}, function(err, result) {
			if (err) {
				logger.error('find user err: ' + err);
				dbObj.close();
				callback(err, null);
			}
			if (result) {
				// found
				logger.info('found user result: ' + JSON.stringify(result));
				dbObj.close();
				return callback(null, result);
			} else {
				// not found - create new
				dbObj.collection(colname).insert(userObj, function(err, result) {
					if (err) {
						logger.error('create user err: ' + err);
						dbObj.close();
						return callback(err, null);
					}			
					// created
					logger.info('create user result: ' + JSON.stringify(result));
					dbObj.close();
					callback(null, result.ops[0]);
				});
			}
		});
	});
};

	return {
		get: get,
		findOrCreate: findOrCreate
	}
}();

module.exports = user; 
