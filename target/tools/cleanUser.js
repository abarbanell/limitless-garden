var logger = require('../util/logger');
var db = require('../util/db');
var util = require('util');
var env = process.env.ENVIRONMENT || 'dev';
var colname = 'sys.' + env + '.user';
logger.info('env.MONGOLAB_URI: ' + process.env.MONGOLAB_URI);
logger.info('env: ' + env);
logger.info('colname: ' + colname);
logger.info('objs to remove: ');
var col = db.collection(colname);
col.find({}, function (err, result) {
    logger.info('find err: ' + err);
    logger.info('find result' + util.inspect(result));
    col.remove({}, function (err, result) {
        logger.info('remove err: ' + err);
        logger.info('remove result: ' + util.inspect(result));
        process.exit(0);
    });
});
//# sourceMappingURL=cleanUser.js.map