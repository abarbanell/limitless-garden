var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.user';

var user = function() { 

	var get = function(id, callback) {
		db.collection(colname).findOne({"_id": id}, callback);
	};

var findOrCreate = function(obj, callback) {
      logger.warn('TODO: user.findOrCreate not implemented');
      callback({status: 'not implemented'}, null);
}
	return {
		get: get,
		findOrCreate: findOrCreate
	}
}();

module.exports = user; 