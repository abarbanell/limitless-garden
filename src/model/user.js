var logger = require('../util/logger');
var util = require('util');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = 'sys.' + env + '.user';

var user = function() { 

	var get = function(id, callback) {
		db.connect(function(err,dbObj){
		logger.info('user.js - called with id=%s for collection=%s', id, colname);
			dbObj.collection(colname).findOne({"_id": id}, {}, function(err,doc){
				logger.info('user.get(%s) - err=%s, doc=%s', id.toString(), util.inspect(err), util.inspect(doc));
				return callback(err,doc);
			});
		});
	};

var findOrCreate = function(obj, callback) {
	logger.info('findOrCreate obj: ' + JSON.stringify(obj));
	var userObj = obj;
	db.connect(function(err,dbObj) {
		dbObj.collection(colname).findOne( { "id": userObj.profile.id }, {}, function(err, result) {
			if (err) {
				logger.error('find user err: ' + err);
				callback(err, null);
			}
			if (result) {
				// found
				logger.info('found user result: ' + JSON.stringify(result));
				return callback(null, result);
			} else {
				// not found - create new
				dbObj.collection(colname).insert(userObj, function(err, result) {
					if (err) {
						logger.error('create user err: ' + err);
						return callback(err, null);
					}			
					// created
						logger.info('did not find user %s, create new user result: %s', userObj.id,  JSON.stringify(result));
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
