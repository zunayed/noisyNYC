//loading up different datasets, default color and max domain value
/*global noiseData: false, heatData: false, graffitiData: false, d3: false  */
"use strict";

var data = [[noiseData, "Blues", 180], [heatData, "Reds", 450], [graffitiData, "RdPu", 40]];

//set up map
var w = screen.width;
var h = screen.height;

var dataSetIndex = 0;
var svg;
var zips;

//legend settings
var dataLegendMax = data[dataSetIndex][2];
var ls_w = 20;
var ls_h = 20;
var nsteps = 9;

//map type & center point 
var projection = d3.geo.mercator()
	.center([-74.000816, 40.752898])
    .scale(195000);

var path = d3.geo.path().projection(projection);

//set up a qX-X number to associate with colorbrew.css styles
var setColor = d3.scale.quantize()
    .domain([0, data[dataSetIndex][2]])
    .range(d3.range(9).map(function(i) { return "q" + (i) + "-9"; }));

var initializeSVG = function () {

	svg = d3.select("#d3_map")
		.append("svg")
		.attr("class", "Blues")
		.attr("width", w)
		.attr("height", h);
};

var createLegend = function () {

	var step = dataLegendMax / nsteps;
	var legendRange = [];

	for (var k = 0 ; k < nsteps ; k++) {
		legendRange.push (Math.floor(k * step));
	}

	var legend = svg.selectAll("g.legend")
		.data(legendRange)
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return h/4 - (i*ls_h) - 2*ls_h; })
		.attr("width", ls_w)
		.attr("height", ls_h)
		.attr("class", function(d) { return setColor(d); });

	legend.append("text")
		.attr("x", 40 + 2)
		.attr("y", function(d, i){ return h/4 - (i*ls_h) - 2*ls_h + 15; })
		.attr("class", "mapSubtext")
		.text(function(d){ return d;});
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

//D3 hover info way
function mouseover(){
	d3.select(this).style("stroke-width", "4px");
	var zip = d3.select(this).attr("title");
	var complaintCount = data[dataSetIndex][0][zip];
	d3.select("#infoBox").html("zip " + zip + " complaints " + complaintCount);

}

function mouseout(){
	d3.select(this).style("stroke-width", "");
}

var zoom = function() {
	var trans = d3.event.translate;
	svg.select("g")
		.attr("transform", "translate(" + trans + ")scale(" + d3.event.scale + ")");
	//scale stroke width based on zoom
	d3.selectAll("#d3_map").attr("stroke-width", ""+ (1.75/d3.event.scale) +"px");
};

var createMap = function (zipcodes) {
	svg.remove();
	initializeSVG();

	svg.call(d3.behavior.zoom().scaleExtent([1/2, 8]).on("zoom", zoom));

	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
		.attr("title", function(d) { return d.id; })
		.attr("class", function(d) { return zipcodeColor(d.id, (data[dataSetIndex])[0]); } )
		.attr("stroke", "#fff")
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.attr("d", path);

	createLegend();
};

//create svg element
initializeSVG();

//reading geoJSON file and assigns it to zipcode
d3.json("static/data/zipcodes.json", function(zipcodes){
	zips = zipcodes;
	return createMap(zipcodes);
});

//monitor dropdown menu to change map colors
d3.select("#colorSelector").on("change", function() {
  d3.selectAll("svg").attr("class", this.value);
});

//monitor dropdown menu to change map data
d3.select("#dataSelector").on("change", function() {
	dataSetIndex = parseInt(this.value);
	dataLegendMax = data[dataSetIndex][2];

	setColor.domain([0, data[dataSetIndex][2]]);
	createMap(zips);

	svg.attr("class", data[dataSetIndex][1]);
});