var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var insertedIds = [];
function insertrows(done) {
    logger.info('insertrows: insert some data');
    var today = new Date();
    var objs = [{
            "soil": 35,
            "host": "rpi03",
            "sensor": ["soil", "temperature"],
            "timestamp": Math.floor(Date.now() / 1000)
        }, {
            "soil": 36,
            "host": "rpi02",
            "sensor": ["soil"],
            "timestamp": today.toISOString()
        }, {
            "host": "no-array",
            "sensor": "stringshouldbearray",
            "timestamp": today.toISOString()
        }];
    db.connect(function (err, dbObj) {
        dbObj.collection(colname).insert(objs, function (err, result) {
            if (err) {
                logger.error('insertrows Error: ' + err);
                done();
            }
            logger.info('insertrows result: ' + JSON.stringify(result));
            insertedIds = result.insertedIds;
            done();
        });
    });
}
;
function droprows(done) {
    db.connect(function (err, dbObj) {
        dbObj.collection(colname).remove({}, function (err, result) {
            if (err) {
                logger.error('droprows() error: ' + err);
            }
            logger.info('droprows() - removed data: ' + JSON.stringify(result));
            done();
        });
    });
}
;
function getIds() {
    return insertedIds;
}
;
function getCollection(callback) {
    db.connect(function (err, dbObj) {
        var c = dbObj.collection(colname);
        callback(c);
    });
}
;
module.exports = {
    insertrows: insertrows,
    droprows: droprows,
    insertedIds: getIds,
    getCollection: getCollection
};
