// dashboard chart with d3.js

// part one - get dataset - some data from all sensors mixed

// limit 30000 is roughly 100 days 
var url = "/api/sensor/" + host + "/" + value + "?limit=30000";

var getdata = function(err, data) {
	var dataset = [];
	console.log("getdata callback");
	var sum = 0;
	var sumsq = 0;
	for (i=0; i< data.length; i++) {
		var rec = data[i];
		var val = rec[value];
		var n = i+1;
		sum += val;
		var mean = (n>0) ? (sum/n) : val;
		sumsq += (val*val);
		var variance = (n > 1) ? (sumsq - (sum*sum)/n)/n : 0;
		var sigma = Math.sqrt(variance);
		var sigval = (sigma > 0) ? (val-mean) / sigma : 0;
		dataset.push({ 
			x: new Date(data[i].date),  
			y: val, 
			n: n, 
			sum: sum, 
			sumsq: sumsq, 
			mean: sum/(i+1), 
			variance: variance, 
			sigma: sigma,
			sigval: sigval });
	}
	visualize(dataset);
	// tabulate(dataset);
}
d3.json(url, getdata);

// part two - show the data as svg chart

var visualize = function(dataset) {
	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

	// Set the ranges
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

	var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

	// Define the line
	var valueline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

	// Define the mean line
	var meanline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.mean); });

	// Define the lower sigma line
	var lowerline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.mean - d.sigma); });

	// Define the mean line
	var upperline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.mean + d.sigma); });

	// set up an array for the four lines
	var lines = [
		{f: valueline, c: "blue"},
		{f: meanline,  c: "grey"},
		{f: lowerline, c: "black"},
		{f: upperline, c: "red"}
	];

	// Adds the svg canvas
	var svg = d3.select(".d3canvas")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain([d3.min(dataset, function(d) { return d.x; }), 
			d3.max(dataset, function(d) { return d.x; })]);
    y.domain([0, d3.max(dataset, function(d) { return d.y; })]);

		// add the lines for values, mean, upper and lower sigma
		for (var i=0; i< lines.length; i++ ) {
			svg.append("path")
				.attr("class", "line")
				.attr("stroke" , lines[i].c)
				.attr("d", lines[i].f(dataset));
		} 

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

var tabulate = function(dataset) {
	var table = d3.select(".d3table")
		.append("table")
		.attr("class", "table table-striped");
	var header = table.append("thead");
	var body = table.append("tbody");
	var row = header.append("tr");
	row.append("td").text("Date");
	row.append("td").text("sensor");
	row.append("td").text("n");
	row.append("td").text("sum");
	row.append("td").text("mean");
	row.append("td").text("var");
	row.append("td").text("sigma");
	row.append("td").text("sigval");

	var bodyrow = body.selectAll("tr")
		.data(dataset)
		.enter()
		.append("tr")
		.attr("style", function(d) {
			if (d.sigval > 1) return "color: red;";
			if (d.sigval < -1) return "color: blue;";
			return "color: green;";
		});

	// Date
	bodyrow.append("td")
		.text(function(d) {
			return d.x.toUTCString();
		});

	// sensor value
	bodyrow.append("td")
		.text(function(d) {
			return d.y;
		});

	// n 
	bodyrow.append("td")
		.text(function(d,i) { 
			return d.n
		});

	// sum 
	bodyrow.append("td")
		.text(function(d,i) { 
			return d.sum;
		});

	// mean 
	bodyrow.append("td")
		.text(function(d,i) { 
			return d.mean;
		});

	// variance
	bodyrow.append("td")
		.text(function(d,i) { 
			return d.variance;
		});

	// sigma
	bodyrow.append("td")
		.text(function(d,i) { 
			return d.sigma;
		});

	// sigval
	bodyrow.append("td")
		.text(function(d,i) { 
			return d.sigval;
		});
} 
