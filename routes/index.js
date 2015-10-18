var express = require('express');
var router = express.Router();
var sensor = require('../model/sensor');
var logger = require('../util/logger');

/* GET home page. */
router.get('/', function (req, res, next) {

    sensor.getMulti(null, 10, function (err, result) {
		logger.info('sensor.getMulti returned: err=' + err);
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err });
		} else {
			logger.info('result = ' + JSON.stringify(result));
			var mapped = result.map(function(obj) {
				var rObj = {};
				//rename some fields
				rObj.date = obj.timestamp;
				rObj.value = obj.soil;
				// copy some fields
				rObj.host = obj.host;
				rObj.sensor = obj.sensor;
				// ignore all other fields and return
				return rObj;
			});
			logger.info('mapped = ' + JSON.stringify(mapped));
			res.render('index', { title: 'Limitless Garden', data: mapped });
		};
	});
});

module.exports = router;
