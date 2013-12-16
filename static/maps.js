//set up map
var w = 1000;
var h = 900;

var dataSetIndex = 0;
var svg;
var zips;

//map type & center point 
var projection = d3.geo.mercator()
	.center([-73.955541, 40.795780])
    .scale(95000);

var path = d3.geo.path().projection(projection);

//loading up different datasets, default color and max domain value
var data = [[noiseData, "Blues", 180], [heatData, "Reds", 450], [graffitiData, "RdPu", 40]];
var dataLegendMin;

//set up a qX-X number to associate with colorbrew.css styles
var setColor = d3.scale.quantize()
    .domain([0, data[dataSetIndex][2]])
    .range(d3.range(9).map(function(i) { return "q" + (i) + "-9"; }));
 
var enableHover = function () {
	$("path").hover(function(){

			zip = $(this).attr("title");
			complaintCount = data[dataSetIndex][0][zip];
			// console.log(complaintCount);
			$("#infoBox").html("zip " + zip + " complaints " + complaintCount);
		}
	);
};

var initializeSVG = function () {

	svg = d3.select("#d3_map")
		.append("svg")
		.attr("class", "Blues")
		.attr("width", w)
		.attr("height", h);
};

var createLegend = function () {

	var ls_w = 20;
	var ls_h = 20;
	var nsteps = 10;
	var step = dataLegendMax / nsteps;
	var legendRange = [];
	for (k = 0 ; k < nsteps ; k++) {
		legendRange.push (Math.floor(k * step));
	}

	var legend = svg.selectAll("g.legend")
		.data(legendRange)
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return h/2 - (i*ls_h) - 2*ls_h;})
		.attr("width", ls_w)
		.attr("height", ls_h)

		.attr("class", function(d, i) { 
			console.log(d)
			return setColor(d); })
		// .attr("class", "q4-9")

	legend.append("text")
		.attr("x", 50)
		.attr("y", function(d, i){ return h/2 - (i*ls_h) - ls_h - 4;})
		.attr("class", "mapSubtext")
		.text(function(d, i){ return d});
}

//map number of complaint to color intensity
var zipcodeColor = function(zip, data) {
	if(zip in data){	
		return setColor(data[zip]);
	}else{
		//no data
		return "white";
	}
};

function zoom() {
	//To Do - Bound limits so you can't pan away from map
	// console.log("zooming", d3.event.scale, d3.event.translate);
	trans = d3.event.translate;
	// trans[0] = Math.min(trans[0], d3.event.scale * 400);
	// trans[0] = Math.max(trans[0], d3.event.scale * -400);
	svg.select("g").attr("transform", "translate(" + trans + ")scale(" + d3.event.scale + ")");
	d3.selectAll("svg").attr("stroke-width", ''+ (1.75/d3.event.scale) +'px');
}

var createMap = function (zipcodes) {
	svg.remove();
	initializeSVG();

	svg.call(d3.behavior.zoom().scaleExtent([.9, 8]).on("zoom", zoom))

	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
	  	.attr("title", function(d) { return d.id })
	  	.attr("class", function(d) { return zipcodeColor(d.id, (data[dataSetIndex])[0]); } )
	  	.attr("stroke", '#fff')
	  	// .attr("bbox", function (d) { console.log(d);
	  	// 							var b = d3.geo.bounds(d);
	  	// 								console.log (b);
	  	// 								return b;
	  	// 							})
		.attr("d", path);

	createLegend();
	enableHover();
}

//create svg element and set max legend value
initializeSVG(); 
dataLegendMax = data[dataSetIndex][2];

//reading geoJSON file and assigns it to zipcode
d3.json('static/data/zipcodes.json', function(zipcodes){
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

	setColor.domain([0, data[dataSetIndex][2]])
	console.log(data[dataSetIndex])
	createMap(zips);

	svg.attr("class", data[dataSetIndex][1]);
});