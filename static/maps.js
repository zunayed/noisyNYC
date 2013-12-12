//set up map
var w = 1000;
var h = 900;
var projection = d3.geo.mercator()
	// .translate([400, -250])
	.center([-73.955541, 40.795780])
    .scale(95000);

var i = 0;
var svg;
var zips;

var path = d3.geo.path().projection(projection);

var data = [[noiseData, "Blues", 190], [heatData, "Reds", 442]];

//set up a qX-X number to associate with colorbrew css styles
var setColor = d3.scale.quantize()
    .domain([0, data[i][2]])
    .range(d3.range(9).map(function(i) { return "q" + (i) + "-9"; }));
 
var enableHover = function () {
	$("path").hover(
		function(){
			zip = $(this).attr("title");
			complaintCount = data[i][0][zip];
			console.log(complaintCount);
			$("#infoBox").html("zip - " + zip + " complaints " + complaintCount);
	},
	function () {
	}
	);
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

var initSVG = function () {
	svg = d3.select("#d3_map")
			.append("svg")
			.attr("class", "Blues")
			.attr("width", w)
			.attr("height", h);
}
	
var createMap = function (zipcodes) {

	//svg.remove();

	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
		  .attr("title", function(d) { return d.id })
		  .attr("class", function(d) { return zipcodeColor(d.id, (data[i])[0]); } )
		  .attr("stroke", '#fff')
		  .attr("stroke-width", '1.75px')

		  // .attr("class", 'zips')

		  // .attr("style", function(d) { 
		  // 	return (d.id in data) ? "fill:rgb(" + (data[d.id] + 30) + ",0,20);" : "";
		  // })
		.attr("d", path);
	enableHover();
}

initSVG();

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
	i = parseInt(this.value);
	console.log(i)
	createMap(zips);

	svg.attr("class", data[i][1]);

});






