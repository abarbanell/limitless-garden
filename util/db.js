
var mongo = require('mongoskin');
var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/lg';
var db = mongo.db(mongourl, {safe: true});

module.exports = db;

