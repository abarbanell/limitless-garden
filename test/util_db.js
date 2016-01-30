// test util/db.js
// also check some basic mongo functionality to make sure 
// we have connectivity

var expect = require('expect.js');
var rewire = require('rewire');
var mongo_url = process.env.TEST_MONGO_URL; 
var mongoClient = require('mongodb').MongoClient;
var logger = require('../util/logger');
var util = require('util');

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
	};

	it('open DB via MONGOLAB_URI in util/db.js?', function(done) {
		process.env.MONGOLAB_URI = mongo_url;
		var db = rewire('../util/db');
		expect(db.connect).to.be.an('function');
		logger.info('m1');
		db.connect(function(err,db1){
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
		expect(db.connect).to.be.an('function');
		db.connect(function(err,db1){
			expect(err).to.not.be.ok();
			check_db(db1, done);
		});
	});  

	it('insert into DB via MONGO_URL in util/db.js?', function(done) {
		if(process.env.MONGOLAB_URI) {
			delete process.env.MONGOLAB_URI;
		}
		process.env.MONGO_URL = mongo_url;
		var db = rewire('../util/db');
		expect(db.connect).to.be.an('function');
		db.connect(function(err,db1){
			expect(err).to.not.be.ok();
			var col = db1.collection('test');
			col.insert({"data": "unit test" }, function(err,r) {
				expect(err).to.not.be.ok();
				expect(r).to.be.an('object');
				expect(r.result).to.be.an('object');
				logger.info('r.result: %s', util.inspect(r.result));
				expect(r.result.ok).to.eql(1);
				expect(r.result.n).to.eql(1);
				check_db(db1, done);
			})
		});
	});  

	it('count is a function returning a number', function(done) {
		var db = rewire('../util/db');
		expect(db.count).to.be.an('function');
		db.count('test', function(err, result) {
			expect(err).to.not.be.ok();
			expect(result).to.be.an('number');
			done();
		});
	});

	it('collectionName is a function returning a string', function(done) {
		var db = rewire('../util/db');
		expect(db.collectionName).to.be.an('function');
		expect(db.collectionName('test')).to.be.an('string');
		done();
	});

	it('collectionName starts with environemnt', function(done) {
		var env = process.env.ENVIRONMENT;
		process.env.ENVIRONMENT='mocha';
		var db = rewire('../util/db');
		expect(db.collectionName).to.be.an('function');
		var s = db.collectionName('test');
		expect(s).to.be.an('string');
		expect(s.startsWith(process.env.ENVIRONMENT)).to.eql(true);
		process.env.ENVIRONMENT = env;
		done();
	});
	
    it('collections function return array', function (done) {
        var db = rewire('../util/db');
        expect(db.collections).to.be.an('function');
        db.collections(function (err, arr) {
            expect(err).to.not.be.ok();
            expect(arr).to.be.an('array');
            done();
        })
    })

});
