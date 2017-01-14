"use strict";
var logger = require('../util/logger');
var db = require('../util/db');
var SensorModel = (function () {
    function SensorModel() {
        this._schema_version = 1;
        this._dummyval = [{
                _id: "id17"
            }];
    }
    SensorModel.prototype.get = function () {
        return this._dummyval;
    };
    SensorModel.prototype.getByID = function (id) {
        return this._dummyval[0];
    };
    SensorModel.prototype.post = function (data) {
        var id = "error";
        return id;
    };
    return SensorModel;
}());
exports.SensorModel = SensorModel;