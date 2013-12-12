var w = 1000;
var h = 900;


//set up map 
var projection = d3.geo.mercator()
	// .translate([400, -250])
	.center([-73.955541, 40.795780])
    .scale(95000);

var path = d3.geo.path().projection(projection);

//set up a qX-X number to associate with colorbrew css styles
var setColor = d3.scale.quantize()
    .domain([-13, 170])
    .range(d3.range(18).map(function(i) { return "q" + (i) + "-9"; }));
 

//map complaint counts to color
var zipcodeColor = function(zip) {
	if(zip in data){	
		return setColor(data[zip]);
	}else{
		//no data
		return "white";
	}
};

var createMap = function (error, zipcodes) {
	var svg = d3.select("#d3_map")
				.append("svg")
				.attr("class", "Reds")
				.attr("width", w)
				.attr("height", h);
		
	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
		  .attr("title", function(d) { return d.id })
		  .attr("class", function(d) { return zipcodeColor(d.id); })
		  .attr("stroke", '#fff')
		  // .attr("class", 'zips')

		  // .attr("style", function(d) { 
		  // 	return (d.id in data) ? "fill:rgb(" + (data[d.id] + 30) + ",0,20);" : "";
		  // })
		.attr("d", path);
}

//readin geoJSON file and assigns it to zipcode
d3.json('static/data/zipcodes.json', function(err, data){
	return createMap(err, data);
});


d3.select("select").on("change", function() {
  d3.selectAll("svg").attr("class", this.value);
});

