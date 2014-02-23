/*global noiseData: false, heatData: false, graffitiData: false, d3: false  */
"use strict";

//loading up different datasets, default color and max domain value
var dataSets = {
	"noise": {
		"data": noiseData,
		"color": "Blues",
		"maxDomain": 425
	},
	"heat": {
		"data": heatData,
		"color": "Reds",
		"maxDomain": 375
	},
	"graffiti": {
		"data": graffitiData,
		"color": "RdPu",
		"maxDomain": 30
	}
};

//set up map
var w = screen.width;
var h = screen.height;

//default dataset to load
var currentData = dataSets.noise;
var svg;
var zips;
var time;

//legend settings
var dataLegendMax = currentData.maxDomain;
var legendWidth = 20;
var legendHeight = 20;
var legendSteps = 9;

//map type & center point 
var projection = d3.geo.mercator()
	.center([-74.000816, 40.752898])
    .scale(195000);

var path = d3.geo.path().projection(projection);

//set up a qX-9 number to associate with colorbrew.css styles
var setColor = d3.scale.quantize()
    .domain([0, currentData.maxDomain])
    .range(d3.range(9).map(function(i) { return "q" + (i) + "-9"; }));


var initializeSVG = function () {
	svg = d3.select("#d3_map")
		.append("svg")
		.attr("class", "Blues")
		.attr("width", w)
		.attr("height", h);
};


var createMap = function (zipcodes) {
	svg.remove();
	initializeSVG();
	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
		.attr('name', function(d) { return d.properties.name })
		.attr("title", function(d) { return d.id; })
		.attr("class", function(d) { return zipcodeColor(d.id, currentData.data); } )
		.attr("stroke", "#fff")
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.on("click", clickEvent)

		.attr("d", path);

	//scaleExtent is the max and min of zoom level
	svg.call(d3.behavior.zoom().scaleExtent([1/2, 8]).on("zoom", zoom));

	createLegend();
};


//map number of complaint to color intensity
var zipcodeColor = function(zip, data) {
	if(zip in data){
		return setColor(data[zip]);
	}else{
		//no data
		return "white";
	}
};


var createLegend = function () {

	var step = dataLegendMax / legendSteps;
	var legendRange = [];

	for (var k = 0 ; k < legendSteps ; k++) {
		legendRange.push (Math.floor(k * step));
	}

	var legend = svg.selectAll("g.legend")
		.data(legendRange)
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return h/4 - (i*legendHeight) - 2*legendHeight; })
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("class", function(d) { return setColor(d); });

	legend.append("text")
		.attr("x", 40 + 2)
		.attr("y", function(d, i){ return h/4 - (i*legendHeight) - 2*legendHeight + 15; })
		.attr("class", "mapSubtext")
		.text(function(d){ return d;});
};


var zoom = function() {
	var trans = d3.event.translate;
	svg.select("g")
		.attr("transform", "translate(" + trans + ")scale(" + d3.event.scale + ")");
	//scale stroke width based on zoom
	d3.selectAll("#d3_map").attr("stroke-width", ""+ (1.75/d3.event.scale) +"px");
};

//Jquery hover way
// var enableHover = function () {
// 	var strokeWidth = $("#d3_map").attr("stroke-width");

// 	$("path").hover(function(){
// 			zip = $(this).attr("title");
// 			console.log("stroke" + strokeWidth);
// 			// $(this).attr("stroke-width", "4px");
// 			complaintCount = data[dataSetIndex][0][zip];
// 			$("#infoBox").html("zip " + zip + " complaints " + complaintCount);
// 		}
// 	})
	
// };


//D3 hoverbox info way
var mouseover = function() {
	d3.select(this).style("stroke-width", "4px");
	var zip = d3.select(this).attr("title");
	var name = d3.select(this).attr("name");
	var complaintCount = currentData.data[zip];
	d3.select("#infoBox").html("Name: " + name + " Zip: " + zip + " Complaints: " + complaintCount);
};


var mouseout = function() {
	d3.select(this).style("stroke-width", "");
};

var clickEvent = function() {
	var zip = d3.select(this).attr("title");
	d3.select("#modalHeader").html("<h3><b>Zip: " + zip + "<b></h3>" + "<div id='chart'></div>");
	lookupTime(zip)
	$('#myModal').foundation('reveal', 'open');
};

//create svg element
initializeSVG();

//reading geoJSON file and assigns it to zipcode
d3.json("static/data/zipcodes.json", function(zipcodes){
	zips = zipcodes;
	return createMap(zips);
});


//monitor dropdown menu to change map colors
d3.select("#colorSelector").on("change", function() {
  d3.selectAll("svg").attr("class", this.value);
});


//monitor dropdown menu to change map data
d3.select("#dataSelector").on("change", function() {
	currentData = dataSets[this.value];
	dataLegendMax = currentData.maxDomain;

	setColor.domain([0, currentData.maxDomain]);
	createMap(zips);

	svg.attr("class", currentData.color);
});


var lookupTime = function(zip) {

	var margin = { top: 50, right: 50, bottom: 50, left: 30 },
	    width = 800 - margin.left - margin.right,
	    height = 480 - margin.top - margin.bottom,
	    gridSize = Math.floor(width / 24),
	    legendElementWidth = gridSize * 2,
	    buckets = 9,

	    colors = ['rgb(254,235,226)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)'],
	    // colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
	    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12a"];

    d3.tsv("static/data/time.tsv",
      function(d) {
      	console.log(d)
        return {
          day: +d.day,
          hour: +d.hour,
          value: +d.value
        };

      },
      function(error, data) {
        var colorScale = d3.scale.quantile()
            .domain([0, 300])
            // .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
            .range(colors);
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dayLabels = svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
              .text(function (d) { return d; })
              .attr("x", 0)
              .attr("y", function (d, i) { return i * gridSize; })
              .style("text-anchor", "end")
              .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
              .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var timeLabels = svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
              .text(function(d) { return d; })
              .attr("x", function(d, i) { return i * gridSize + 15; })
              .attr("y", 0)
              .style("text-anchor", "middle")
              .attr("transform", "translate(" + gridSize / 2 + ", -6)")
              .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

        var heatMap = svg.selectAll(".hour")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) { return (d.hour - 1) * gridSize + 50; })
            .attr("y", function(d) { return (d.day - 1) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .style("fill", function(d) { return colorScale(d.value); });


        // heatMap.transition().duration(4000)
        //     .style("fill", function(d) { return colorScale(d.value); });

        heatMap.append("title").text(function(d) { return d.value; });
            
        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; })
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height - 100)
          .attr("width", legendElementWidth)
          .attr("height", gridSize / 2)
          .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
          .attr("class", "mono")
          .text(function(d) { return "≥ " + Math.round(d); })
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height + gridSize - 100);
    });
};



