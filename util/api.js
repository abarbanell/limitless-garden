

var api = function () {

    var https = require('https');
    var logger = require('./logger');

    // get data from API call
    var get = function (options, callback) {
        var start = Date.now();
        var request = https.get(options, function (response) {
            logger.info("Got response: " + response.statusCode);
            // data is streamed in chunks from the server
            // so we have to handle the "data" event    
            var buffer = "";

            response.on("data", function (chunk) {
                buffer += chunk;
            });

            response.on("end", function () {
                // finished transferring data
                // dump the raw data
                if (buffer.length) {
                    var data = JSON.parse(buffer);
                    logger.info('api call {' + options + '} returned - ' + (Date.now() - start) + ' ms');
                    callback(null, data);
                } else {
                    callback({
                        error: "Empty response"
                    }, null);
                }
            });

        });
        request.on('error', function (err) {
            callback({ error: 'connection error' }, null);
        });

    };

    return {
        get: get
    }

} ();

module.exports = api;