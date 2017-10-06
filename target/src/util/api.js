var api = function () {
    var https = require('https');
    // get data from API call
    var get = function (options, callback) {
        var start = Date.now();
        var request = https.get(options, function (response) {
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
                    callback(null, data);
                }
                else {
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
    };
}();
module.exports = api;
