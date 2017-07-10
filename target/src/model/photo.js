var logger = require('../util/logger');
var util = require('util');
var env = process.env.ENVIRONMENT || 'dev';
var api = require('../util/api.js');
var photo = function () {
    var get = function (count, callback) {
        var url = 'https://www.googleapis.com/drive/v3/files?pageSize=10&spaces=photos&fields=files(contentHints%2CcreatedTime%2Cdescription%2CiconLink%2CimageMediaMetadata(cameraMake%2CcameraModel%2Clocation)%2CthumbnailLink%2CwebContentLink%2CwebViewLink)';
        api.get(url, function (err, docs) {
            logger.error('api called'); // log and forward - should really parse as well
            logger.error(util.inspect(docs));
            callback(err, docs);
        });
    };
    return {
        get: get
    };
}();
module.exports = photo;
