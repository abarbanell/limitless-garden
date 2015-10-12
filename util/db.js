
var mongo = require('mongoskin');
var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/lg';
var db = mongo.db(mongourl, {safe: true});
db.ObjectID = mongo.ObjectID; // copy helper class over...

module.exports = db;

