"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var hb_model_1 = require("../model/hb.model");
var threescale = require('../util/threescale');
router.use(threescale);
// POST /api/heartbeat -> log one entry
router.post('/', function (req, res, next) {
    try {
        var hb = new hb_model_1.Heartbeat();
        hb.populate(req.body);
        hb.post().subscribe(function (s) {
            var str = s;
            var payload = { _id: str, rc: "OK" };
            res.json(payload);
        }, function (e) {
            logger.error('post failed: ', e);
        });
    }
    catch (ex) {
        logger.error('heartbeat router post("/") exception ', ex);
    }
});
module.exports = router;
