$(function(){ 
var w = 1000;
var h = 600;




d3.json('zipcodes.json', function(err, data){
	return doit(err, data);
});

var projection = d3.geo.mercator()
    // .scale(5000)
    // .translate([w / 2, h / 2]);

var path = d3.geo.path()
    .projection(projection);


// path = path.projection(projection);

var doit = function (err, zipcodes) {
	console.log("Preparing map");
	var svg = d3.select("#d3_map")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
	
	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
		.attr("d", path);
	console.log("done");

	// svg.append("g")
 //      .attr("class", "counties")
 //    .selectAll("path")
      //.data(topojson.feature(zipcodes).features)
    //   .data(zipcodes)
    // .enter()
    // .append("path")
    //   .attr("class", function(d) { return quantize(rateById.get(d.id)); })
    //   .attr("d", path);

  // svg.append("path")
  //     .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  //     .attr("class", "states")
  //     .attr("d", path);	
}

});