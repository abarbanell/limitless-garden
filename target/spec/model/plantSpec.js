//var rewire = require('rewire');
var plant = require('../../src/model/plant.js');
var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.plant';
var insertedIds = [];
describe('plant Model ', function () {
    beforeEach(function (done) {
        droprows(function () {
            return insertrows(done);
        });
    });
    function insertrows(done) {
        logger.info('insertrows: insert some data');
        var today = new Date();
        var objs = [{
                "name": "Hibiscus",
                "species": "Hibiscus major",
                "location": "living room",
                "sensors": [{ "type": "soil", "host": "rpi02" },
                    { "type": "temp", "host": "rpi02" },
                    { "type": "humidity", "host": "rpi02" }],
                "timestamp": Math.floor(Date.now() / 1000)
            }, {
                "name": "Ficus",
                "species": "Ficus Benjamin",
                "location": "living room",
                "sensors": [{ "type": "soil", "host": "wino-18fe34f3738b" },
                    { "type": "temp", "host": "rpi02" },
                    { "type": "humidity", "host": "rpi02" }],
                "timestamp": today.toISOString()
            }, {
                "name": "Ficus 2",
                "species": "Ficus Benjamin",
                "location": "office room",
                "sensors": [],
                "timestamp": today.toISOString()
            }];
        db.connect(function (err, dbObj) {
            dbObj.collection(colname).insert(objs, function (err, result) {
                if (err) {
                    logger.error('insertrows Error: ' + err);
                    return done();
                }
                logger.info('insertrows result: ' + JSON.stringify(result));
                insertedIds = result.insertedIds;
                return done();
            });
        });
    }
    ;
    afterEach(function (done) {
        return droprows(done);
    });
    function droprows(done) {
        db.connect(function (err, dbObj) {
            dbObj.collection(colname).remove({}, function (err, result) {
                if (err) {
                    logger.error('droprows() error: ' + err);
                }
                logger.info('droprows() - removed data: ' + JSON.stringify(result));
                return done();
            });
        });
    }
    ;
    it('should contain get and some other methods ', function (done) {
        expect(typeof (plant)).toBe('object');
        expect(typeof (plant.get)).toBe('function');
        expect(typeof (plant.getMulti)).toBe('function');
        expect(typeof (plant.create)).toBe('function');
        expect(typeof (plant.getSpecies)).toBe('function');
        return done();
    });
    it('get a single value - notfound', function (done) {
        plant.get("notexistingid", function (err, result) {
            // not found would return both err= null and result = null (or empty object{} )
            logger.info('get single - notfound - returns err=%s and result=%s', typeof (err), typeof (result));
            if (err) {
                logger.info('err = %s', JSON.stringify(err));
            }
            expect(err).not.toBeTruthy();
            expect(result).not.toBeTruthy();
            return done();
        });
    });
    it('get a single value - found', function (done) {
        plant.get(insertedIds[0], function (err, result) {
            if (err) {
                logger.error('err = ' + JSON.stringify(err));
                return done();
            }
            else {
                expect(err).not.toBeTruthy();
                expect(result).toBeTruthy();
                expect(result._id).toEqual(insertedIds[0]);
                return done();
            }
        });
    });
    it('should get an array of values', function (done) {
        plant.getMulti({}, {}, function (err, result) {
            logger.info('model_plant test: getmulti callback reached');
            if (err) {
                logger.error('err = ' + JSON.stringify(err));
                return done();
            }
            else {
                expect(err).not.toBeTruthy();
                expect(result).toBeTruthy();
                logger.info('getMulti result: ' + JSON.stringify(result));
                expect(result.length).toEqual(insertedIds.length);
                return done();
            }
        });
    });
    it('should get distinct species', function (done) {
        plant.getSpecies(function (err, result) {
            if (err) {
                logger.error('plant.js - error in getSpecies()');
            }
            ;
            expect(err).not.toBeTruthy();
            expect(result).toBeTruthy();
            expect(typeof (result.length)).toBe('number');
            expect(result.length).toEqual(2);
            return done();
        });
    });
    // not possible without rewire - private method
    // it('check private check() function', function(done) {
    // 	var private_check = plant.__get__('check');
    // 	expect(typeof(private_check)).toBe('function');
    // 	var lobj = private_check({});
    // 	expect(lobj.name).toEqual("unknown");
    // 	lobj = private_check({name: "n1", species: "s1", location: "l1"});
    // 	expect(lobj.name).toEqual("n1");
    // 	expect(lobj.species).toEqual("s1");
    // 	expect(lobj.location).toEqual("l1");
    // 	done();
    // }); 
    it('should create a new entry', function (done) {
        var obj = {
            "name": "new Hibiscus",
            "species": "Hibiscus major",
            "location": "living room",
            "sensors": [{ "type": "soil", "host": "rpi03" },
                { "type": "temp", "host": "rpi02" },
                { "type": "humidity", "host": "rpi02" }],
            "timestamp": Math.floor(Date.now() / 1000)
        };
        plant.create(obj, function (err, result) {
            if (err) {
                logger.error('plan.js - create failed: ' + (err.err || "no error"));
            }
            expect(err).not.toBeTruthy();
            expect(result).toBeTruthy();
            return done();
        });
    });
});
