// dashboard chart with d3.js

// part one - get dataset - some random data

var url = "/api/collections/sensor?limit=100&filldate=true";

var getdata = function(err, data) {
	var dataset = [];
	console.log("getdata callback");
	var sum = 0;
	for (i=0; i< data.length; i++) {
		dataset.push({ x: new Date(data[i].date),  y: data[i].soil, n: i+1, sum: sum+=data[i].soil, mean: sum/(i+1) });
	}
	visualize(dataset);
	tabulate(dataset);
}
d3.json(url, getdata);

// part two - show the data as svg chart

var visualize = function(dataset) {
	// Set the dimensions of the canvas / graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

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

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(dataset));

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

	var bodyrow = body.selectAll("tr")
		.data(dataset)
		.enter()
		.append("tr");

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
} 
