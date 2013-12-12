$(function(){ 
var w = 1400;
var h = 1000;

d3.json('zipcodes.json', function(err, data){
	return doit(err, data);
});

var projection = d3.geo.mercator()
	// .translate([400, -250])
	.center([-73.945541, 40.795780])
    .scale(90000);

var path = d3.geo.path().projection(projection);

var scale = d3.scale.linear()
    	        .domain([1,170])
        	    .range([2,8]);

var quantize = d3.scale.quantize()
    .domain([-80, 170])
    .range(d3.range(12).map(function(i) { return "q" + (i) + "-9"; }));

var zipcodeColor = function(zip) {
	if(zip in data){	
		return quantize(data[zip]);

	}else{
		return "blue";
	}
};

var doit = function (err, zipcodes) {
	var svg = d3.select("#d3_map")
			.append("svg")
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

});