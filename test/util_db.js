// test util/db.js
// also check some basic mongo functionality to make sure 
// we have connectivity

var expect = require('expect.js');
var rewire = require('rewire');
var mongo_url = process.env.TEST_MONGO_URL; 
var mongoClient = require('mongodb').MongoClient;
var logger = require('../util/logger');

describe('util/db tests', function() {
	
	it('test mongo url defined?', function(done) {
		expect(mongo_url).to.contain('mongodb');
		done();
	});

  it('open DB from mongodb driver directly?', function(done){		
		mongoClient.connect(mongo_url, function(err, db) {
			expect(err).to.not.be.ok();
			check_db(db, done);
		});
	});

 it('mongo has ObjectID?', function(done){		
		var ObjectID = require('mongodb').ObjectID;
		var oid = new ObjectID('aabbaabbaabbaabbaabbaabb');
		logger.info('o0 - typeof ObjectID = %s', typeof(ObjectID));
		expect(ObjectID).to.be.an('function');
		logger.info('o1: - typeof oid = %s', typeof(oid));
		expect(oid).to.be.an('object');
		logger.info('o2');
		done();
	});

 it('mongo has ObjectID.isValid()?', function(done){		
		var ObjectID = require('mongodb').ObjectID;
		expect(ObjectID.isValid).to.be.an('function');		
		expect(ObjectID.isValid('aabbaabbaabbaabbaabbaabb')).to.be.ok();
		expect(ObjectID.isValid(17)).to.be.ok();
		expect(ObjectID.isValid('aabbaabbaabbaabbaabb')).to.not.be.ok();
		expect(ObjectID.isValid('not-a-hex-string')).to.not.be.ok();
		done();
	});

	var check_db = function(db, done) {
		expect(db).to.be.ok();
		expect(db).to.be.an('object');
		expect(db.close).to.be.an('function');
		db.close();
		done();
/****
		expect(db.bind).to.be.an('function');
		db.bind('testcollection');
		expect(db.testcollection).to.be.an('object');
		expect(db.testcollection.find).to.be.an('function');
		db.testcollection.find().toArray(function(err, items) {
			if (err) console.log('err: ' + err);
			expect(err).to.not.be.ok();
			expect(items).to.be.an('array');
			done();
		});
*****/
	};

	it('open DB via MONGOLAB_URI in util/db.js?', function(done) {
		process.env.MONGOLAB_URI = mongo_url;
		var db = rewire('../util/db');
		logger.info('m0 - typeof(db): %s', typeof(db));
		expect(db).to.be.an('function');
		logger.info('m1');
		db(function(err,db1){
			logger.info('m2');
			expect(err).to.not.be.ok();
			logger.info('m3');
			check_db(db1, done);
		});
	});  
	
	it('open DB via MONGO_URL in util/db.js?', function(done) {
		if(process.env.MONGOLAB_URI) {
			delete process.env.MONGOLAB_URI;
		}
		process.env.MONGO_URL = mongo_url;
		var db = rewire('../util/db');
		logger.info('m0 - typeof(db): %s', typeof(db));
		expect(db).to.be.an('function');
		logger.info('m1');
		db(function(err,db1){
			logger.info('m2');
			expect(err).to.not.be.ok();
			logger.info('m3');
			check_db(db1, done);
		});
	});  

});
