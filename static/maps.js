//loading up different datasets, default color and max domain value
var data = [[noiseData, "Blues", 180], [heatData, "Reds", 450], [graffitiData, "RdPu", 40]];

//set up map
var w = $(window).width();
var h = $(window).height();

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

	for (k = 0 ; k < nsteps ; k++) {
		legendRange.push (Math.floor(k * step));
	}

	var legend = svg.selectAll("g.legend")
		.data(legendRange)
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return h/3.5 - (i*ls_h) - 2*ls_h;})
		.attr("width", ls_w)
		.attr("height", ls_h)

		.attr("class", function(d, i) { 
			console.log(d)
			return setColor(d); })
		// .attr("class", "q4-9")

	legend.append("text")
		.attr("x", 40 + 2)
		.attr("y", function(d, i){ return h/3.5 - (i*ls_h) - ls_h - 4;})
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

var zoom = function() {

	trans = d3.event.translate;
	svg.select("g").attr("transform", "translate(" + trans + ")scale(" + d3.event.scale + ")");
	//scale stroke width based on zoom
	d3.selectAll("svg").attr("stroke-width", ''+ (1.75/d3.event.scale) +'px');
}

var enableHover = function () {
	$("path").hover(function(){

			zip = $(this).attr("title");
			complaintCount = data[dataSetIndex][0][zip];
			// console.log(complaintCount);
			$("#infoBox").html("zip " + zip + " complaints " + complaintCount);
		}
	);
};

var createMap = function (zipcodes) {
	svg.remove();
	initializeSVG();

	svg.call(d3.behavior.zoom().scaleExtent([.5, 8]).on("zoom", zoom))

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

//create svg element 
initializeSVG(); 

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