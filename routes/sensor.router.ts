import * as express from 'express';
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');

import { SensorModel }  from '../model/sensor.model';
import { Observable } from 'rxjs/Rx'

var threescale = require('../util/threescale');
router.use(threescale);

var sensorModel = new SensorModel();

/* GET api  */
router.get('/', function(req, res, next) {
	sensorModel.get().subscribe(s => {
			logger.error('subscription returned: ', s);
		  res.json(s);
	});
});

module.exports = router;



