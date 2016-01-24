var expect = require('expect.js');
var util = require('util');
var user = require('../model/user.js');
var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = 'sys.' + env + '.user';

var insertedIds = [];
var objs = [{
		profile: { id: "dummyId123", displayName: "J Smith", name: "John Smith"}, 
		"timestamp": "2015-09-29T19:23:12.435121"
	}, {
		profile: { id: "dummyId456", displayName: "J Doe" , name: "John Doe"},
		"timestamp": "2015-09-29T19:24:12.435121"
	}];

describe('User Model ', function() {
	beforeEach(function(done) {
		droprows(function(){
			insertrows(done);
		});
	});
	
	function insertrows(done){
		logger.info('insertrows: insert some data');
		db.connect(function(err,dbObj){
			dbObj.collection(colname).insert(objs, function(err, result) {
				if (err) {
					logger.error('insertrows Error: ' + err);
					done();
				} 
				logger.info('insertrows result: ' + JSON.stringify(result));
				insertedIds = result.insertedIds;
				dbObj.close();
				done();
			});
		});
	};
	
	after(function(done){
		droprows(done);
	});	
	
	function droprows(done) {
		db.connect(function(err,dbObj){
			dbObj.collection(colname).remove({}, function(err, result) {
				if (err) {
					logger.error('droprows() error: '+ err);
				}
				logger.info('droprows() - removed data: ' + util.inspect(result));
				dbObj.close();
				done();
			});
		});
	};
	
  it('should contain get and findOrCreate methods ', function(){
      expect(user).to.be.an('object');
      expect(user.get).to.be.an('function');
      expect(user.findOrCreate).to.be.an('function');	
  });

	it('get a single value - notfound', function(done) {
		user.get("notexistingid", function(err, result) { 
			// not found would return both err= null and result = null (or empty object{} )
			logger.info('user.js - get single - notfound - returns err=%s and result=%s', util.inspect(err), util.inspect(result));
			if (err) {
				logger.info('user.js - err = %s', JSON.stringify(err));
			}
			expect(err).to.not.be.ok(); 
			expect(result).to.not.be.ok();
		  done();
		});
	});
	
it('get a single value - found', function (done) {
	logger.info('model_user.js - insertedIds = %s', JSON.stringify(insertedIds));
	user.get(insertedIds[0], function (err, result) {
		if (err) {
			logger.error('user.js - err = ' + JSON.stringify(err));
			return done();
		} 
			expect(err).to.not.be.ok();
			logger.info('model_user.js - result = %s', typeof(result));
			logger.info('model_user.js - result = %s', JSON.stringify(result));
			expect(result).to.be.ok();
			expect(result).to.be.an('object');
			expect(result._id).to.eql(insertedIds[0]);
			done();
		
		});
	});

	it('should findOrCreate an entry - new user', function(done) {
		newObj = { 
			profile: { id: "dummyId456", displayName: "Jack Douglas" },
			"timestamp": "2015-09-29T19:25:12.435121"
		};
		user.findOrCreate(newObj, function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				logger.info('findOrCreate result: ' + JSON.stringify(result));
				expect(result.profile.id).to.eql(newObj.profile.id);
				done();
			}
		});
	});

	it('should findOrCreate an entry - existing user', function(done) {
		newObj = objs[1];
		user.findOrCreate(newObj, function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				logger.info('findOrCreate result: ' + JSON.stringify(result));
				expect(result._id).to.eql(insertedIds[1]);
				done();
			}
		});
	});

});
