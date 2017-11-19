var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.sensor';
var d = new Date();
var d2 = new Date();
d2.setDate(d2.getDate() - 1);
dstr = d.toISOString();
d2str = d2.toISOString();
var objs = [
    { host: 'rpi01', timestamp: dstr, sensor: 'soil', soil: 36 },
    { host: 'rpi02', timestamp: dstr, sensor: 'soil', soil: 136 },
    { host: 'rpi01', timestamp: d2str, sensor: 'soil', soil: 37 },
    { host: 'rpi02', timestamp: d2str, sensor: 'soil', soil: 137 },
];
logger.info('env.MONGOLAB_URI: ' + process.env.MONGOLAB_URI);
logger.info('env: ' + env);
logger.info('colname: ' + colname);
logger.info('objs to insert: ' + JSON.stringify(objs));
var col = db.collection(colname);
col.insert(objs, function (err, result) {
    logger.info('err: ' + err);
    logger.info('result' + JSON.stringify(result));
    process.exit(0);
});
//# sourceMappingURL=seed.js.map