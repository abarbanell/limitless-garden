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
			res.render('index', { title: 'Limitless Garden', data: result });
		};
	});
});

module.exports = router;
