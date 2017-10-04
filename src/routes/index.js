var express = require('express');
var router = express.Router();
var db = require('../util/db');
var sensor = require('../model/sensor');
var photo = require('../model/photo');
var logger = require('../util/logger');
var util = require('util');
var authenticated = require('../util/authenticated');
var ObjectID = require('mongodb').ObjectID;

var sensorRoute = function (req, res, next) {
    sensor.getMulti({}, {limit: 10} , function (err, result) {
		logger.info('sensor.getMulti returned: err=' + err);
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err });
		} else {
			res.render('sensor', { 
				title: 'Limitless Garden', 
				dataTable: true, 
				hostsTable: false, 
				collectionsTable: false,
				data: result, 
				user: req.user 
			});
		};
	});
};

var collectionsListRoute = function (req, res, next) {
	db.collections(function(err, names) {
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err});
		} else {
			res.render('index', { 
				title: 'Limitless Garden - Collections list', 
				data: names,
				user: req.user,
				count: names.length
			});
		}
	});
};

var collectionsRoute = function (req, res, next) {
	req.collection.count(function(err, count) {
		if (err) {
			logger.error('error in collectionRoute() - count; %s', util.inspect(err));
			res.status(500).render('error', { err: err});
		} else {
			req.collection.find({}, { limit: 20, sort: { "_id": -1 }}, function(err, result) {
				if (err) {
					logger.error('error in collectionRoute(); %s', util.inspect(err));
					res.status(500).render(error, { err: err});
				} else {
					result.toArray(function(err, arr) {
						var mapped = arr.map(function(obj) {
							return util.inspect(obj);
						});
						res.render('collection', { 
							title: 'Limitless Garden - Collection: ' + req.params.collectionName, 
							data: mapped,
							count: count,
							user: req.user
						});
					});
				}
			});
		}
	});
};

var hostsRoute = function (req, res, next) {
	sensor.getUniqueHosts(function (err, result) {
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err});
		} else {
			logger.info('routes/index.js hostsRoute(), result = ' + JSON.stringify(result));	
			res.render('hosts', { 
				title: 'Limitless Garden - Hosts', 
				data: result,
				user: req.user
			});
		}
	});
};

var hostDataRoute = function (req, res, next) {
	var host = req.params.host;
    sensor.getMulti({host: host}, {limit: 20, sort: { "_id": -1}} , function (err, result) {
		logger.info('sensor.getMulti returned: err=' + err);
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err });
		} else {
			logger.info('routes/index.js hostsDataRoute(), result = ' + JSON.stringify(result));	
			var mapped = result.map(function(obj) {
				var rObj = {};
				//rename some fields
				if(obj.timestamp) {
					if (typeof(obj.timestamp) == 'number') { // UNIX timestamp
						var date = new Date(obj.timestamp * 1000)
						rObj.date = date.toJSON();
					} else { 
						var date = new Date(obj.timestamp);
						rObj.date = date.toJSON();
					}
				} else { 
					// no timestamp, generate from Obejct ID
					rObj.date = ObjectID(obj._id).getTimestamp();
				}
				// copy some fields
				if (obj.host) rObj.host = obj.host;
				if (obj.sensor) { 
					if (Array.isArray(obj.sensor)) {
						logger.info('routes/index.js hostDataRoute: sensor detected as array');
						rObj.sensor = obj.sensor;
					} else { 
						logger.error('routes/index.js hostDataRoute: sensor is not detected as array, will be wrapped. type: ' + 
								typeof(obj.sensor) + ', JSON before wrapping: ' + util.inspect(obj.sensor));
						rObj.sensor = [ obj.sensor ];
					}
				}
				if (obj.soil) rObj.soil = obj.soil;
				if (obj.humidity) rObj.humidity = obj.humidity;
				if (obj.capacitance) rObj.capacitance = obj.capacitance;
				if (obj.light) rObj.light = obj.light;
				if (obj.temperature) rObj.temperature = obj.temperature;
				// ignore all other fields and return
				return rObj;
			});
			logger.info('mapped = ' + JSON.stringify(mapped));
			res.render('hostdata', { 
				title: 'Limitless Garden', 
				data: mapped, 
				user: req.user,
				dashurl: "/dashboard/"+ host
			});
		};
	});
};

router.param('collectionName', function(req, res, next, collectionName){
	db.connect(function(err, dbObj) {
		req.collection = dbObj.collection(db.collectionName(collectionName));
		return next()
	});
});

/* Middleware */
//router.use(authenticated.cookie);
router.use(authenticated.admin);

/* GET home page. */
router.get('/', authenticated.cookie, collectionsListRoute);
router.get('/collections/:collectionName', authenticated.cookie, collectionsRoute);

/* GET sensor page. */
router.get('/sensor', authenticated.cookie, sensorRoute);

/* temporarily park some routes which will be filled later */ 
router.get('/hosts/:host', authenticated.cookie, hostDataRoute);
router.get('/hosts', authenticated.cookie, hostsRoute);

/* GET login page. */
router.get('/login', function (req, res, next) {
			res.render('login',  { 
				title: 'Limitless Garden',
				user: req.user
			});
});

/* GET about page. */
router.get('/about',  function (req, res, next) {
			res.render('about', { 
				 title: 'Limitless Garden',
				 user: req.user
			});
});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/dashboard/:host/:field', authenticated.cookie, function(req, res) {
		res.render('dashboard', { 
			title: 'Limitless Garden Dashboard',
			host: req.params.host,
			user: req.user,
			field: req.params.field,
			dataurl: "/hosts/" + req.params.host
		});
});

module.exports = router;
