"use strict";
var express = require("express");
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var sensor_model_1 = require("../model/sensor.model");
var threescale = require('../util/threescale');
router.use(threescale);
var sensorModel = new sensor_model_1.SensorModel();
// GET /api/sensors -> list of sensors
router.get('/', function (req, res, next) {
    sensorModel.get().subscribe(function (s) {
        res.json(s);
    }, function (e) {
        logger.error('sensor router get("/") error: ', e);
    });
});
// POST /api/sensors -> create new sensor 
router.post('/', function (req, res, next) {
    try {
        sensorModel.post(req.body).subscribe(function (s) {
            logger.error('post succceeded: ', s);
            var payload = { _id: s, rc: "OK" };
            res.json(payload);
        }, function (e) {
            logger.error('post failed: ', e);
        });
    }
    catch (ex) {
        logger.error('sensor router post("/") exception ', ex);
    }
});
module.exports = router;
