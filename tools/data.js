// convert a json output to input for chart
// input: [{"_id":"568d71ec7ce7290900578235","host":"wino-18fe34f3738b","soil":92},...]
// output: [{"date":"2106-01-06 21:15:10.00000Z","soil":92},...]

var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var util = require('util');

var input = JSON.parse(fs.readFileSync('./public/data/data-in.json'));



var output = input.map(function(item) {
    if (item._id) {
        var objectid = ObjectID(item._id);
        item.date = objectid.getTimestamp().toISOString();
        delete item._id;
    }
    if (item.host) {
        delete item.host;
    }
    return item;
})

console.log(util.inspect(output));

fs.writeFileSync('./public/data/data.json', JSON.stringify(output));


