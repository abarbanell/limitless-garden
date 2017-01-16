"use strict";
var express = require("express");
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var sensor_model_1 = require("../model/sensor.model");
var threescale = require('../util/threescale');
router.use(threescale);
var sensorModel = new sensor_model_1.SensorModel();
/* GET api  */
router.get('/', function (req, res, next) {
    sensorModel.get().subscribe(function (s) {
        logger.error('subscription returned: ', s);
        res.json(s);
    });
});
module.exports = router;
