// test util/db.js
// also check some basic mongo functionality to make sure 
// we have connectivity

var rewire = require('rewire');
var mongo_url = process.env.TEST_MONGO_URL; 
var mongoClient = require('mongodb').MongoClient;
var logger = require('../../util/logger');
var util = require('util');

describe('util/db tests', function() {
	
	it('test mongo url defined?', function(done) {
		expect(mongo_url).toContain('mongodb');
		done();
	});

  it('open DB from mongodb driver directly?', function(done){		
		mongoClient.connect(mongo_url, function(err, db) {
			expect(err).not.toBeTruthy();
			check_db(db, done);
		});
	});

 it('mongo has ObjectID?', function(done){		
		var ObjectID = require('mongodb').ObjectID;
		var oid = new ObjectID('aabbaabbaabbaabbaabbaabb');
		logger.info('o0 - typeof ObjectID = %s', typeof(ObjectID));
		expect(ObjectID).toBeA(Function);
		logger.info('o1: - typeof oid = %s', typeof(oid));
		expect(oid).toBeA(Object);
		logger.info('o2');
		done();
	});

 it('mongo has ObjectID.isValid()?', function(done){		
		var ObjectID = require('mongodb').ObjectID;
		expect(ObjectID.isValid).toBeA(Function);		
		expect(ObjectID.isValid('aabbaabbaabbaabbaabbaabb')).toBeTruthy();
		expect(ObjectID.isValid(17)).toBeTruthy();
		expect(ObjectID.isValid('aabbaabbaabbaabbaabb')).not.toBeTruthy();
		expect(ObjectID.isValid('not-a-hex-string')).not.toBeTruthy();
		done();
	});

	var check_db = function(db, done) {
		expect(db).toBeTruthy();
		expect(db).toBeA(Object);
		expect(db.close).toBeA(Function);
		db.close();
		done();
	};

	it('open DB via MONGOLAB_URI in util/db.js?', function(done) {
		process.env.MONGOLAB_URI = mongo_url;
		var db = rewire('../../util/db');
		expect(typeof(db.connect)).toEqual('function');
		logger.info('m1');
		db.connect(function(err,db1){
			logger.info('m2');
			expect(err).not.toBeTruthy();
			logger.info('m3');
			check_db(db1, done);
		});
	});  
	
	it('open DB via MONGO_URL in util/db.js?', function(done) {
		if(process.env.MONGOLAB_URI) {
			delete process.env.MONGOLAB_URI;
		}
		process.env.MONGO_URL = mongo_url;
		var db = rewire('../../util/db');
		expect(db.connect).toBeA(Function);
		db.connect(function(err,db1){
			expect(err).not.toBeTruthy();
			check_db(db1, done);
		});
	});  

	it('insert into DB via MONGO_URL in util/db.js?', function(done) {
		if(process.env.MONGOLAB_URI) {
			delete process.env.MONGOLAB_URI;
		}
		process.env.MONGO_URL = mongo_url;
		var db = rewire('../../util/db');
		expect(db.connect).toBeA(Function);
		db.connect(function(err,db1){
			expect(err).not.toBeTruthy();
			var col = db1.collection('test');
			col.insert({"data": "unit test" }, function(err,r) {
				expect(err).not.toBeTruthy();
				expect(r).toBeA(Object);
				expect(r.result).toBeA(Object);
				logger.info('r.result: %s', util.inspect(r.result));
				expect(r.result.ok).toEqual(1);
				expect(r.result.n).toEqual(1);
				check_db(db1, done);
			})
		});
	});  

	it('count is a function returning a number', function(done) {
		var db = rewire('../../util/db');
		expect(db.count).toBeA(Function);
		db.count('test', function(err, result) {
			expect(err).not.toBeTruthy();
			expect(result).toBeA(Number);
			done();
		});
	});

	it('collectionName is a function returning a string', function(done) {
		var db = rewire('../../util/db');
		expect(db.collectionName).toBeA(Function);
		expect(db.collectionName('test')).toBeA(String);
		done();
	});

	it('collectionName starts with environemnt', function(done) {
		var env = process.env.ENVIRONMENT;
		process.env.ENVIRONMENT='jsm';
		var db = rewire('../../util/db');
		expect(db.collectionName).toBeA(Function);
		var s = db.collectionName('test');
		expect(s).toBeA(String);
		expect(s.startsWith(process.env.ENVIRONMENT)).toEqual(true);
		process.env.ENVIRONMENT = env;
		done();
	});
	
    it('collections function return array', function (done) {
        var db = rewire('../../util/db');
        expect(db.collections).toBeA(Function);
        db.collections(function (err, arr) {
            expect(err).not.toBeTruthy();
		logger.info('arr is of type: ' + typeof(arr));
		logger.info('arr = '+ util.inspect(arr));
            expect(arr).toBeA(Array);
            done();
        })
    })
});
