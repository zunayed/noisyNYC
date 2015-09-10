/*global d3: false  */
"use strict";

var bk_data = {"11239":300000,"11236":397469,"11224":398044,"11207":452684,"11208":454972,"11234":517813,"11209":595357,"11235":602813,"11203":639223,"11229":664482,"11230":705076,"11214":780774,"11221":793594,"11228":797811,"11219":808581,"11220":808901,"11223":840553,"11210":841173,"11204":848101,"11233":899852,"11232":901314,"11218":927963,"11213":967582,"11237":979830,"11205":991422,"11216":1091611,"11227":1200000,"11201":1261451,"11222":1270205,"11215":1303978,"11206":1396058,"11238":1441217,"11225":1563560,"11211":1678405,"11231":1709018,"11226":1718774,"11217":1730570,"11212":1794255,"11249":2101620}

var qn_data = {"11693":239633,"11414":345251,"11415":347473,"11004":349980,"11412":362403,"11429":363818,"11040":395632,"11422":410746,"11420":413430,"11372":415511,"11413":415904,"11434":418091,"11411":420907,"11427":423016,"11426":442724,"11419":446922,"11417":449060,"11433":456958,"11374":459312,"11421":460427,"11416":472075,"11001":489641,"11360":490503,"11428":492949,"11364":499978,"11692":507946,"11436":511476,"11369":517024,"11694":534335,"11355":540663,"11362":543987,"11691":558820,"11357":562206,"11375":569431,"11435":574355,"11005":592509,"11418":613753,"11423":617407,"11365":619640,"11379":628935,"11356":636741,"11370":643561,"11363":654327,"11432":692039,"11377":692867,"11368":694582,"11361":712681,"11109":718987,"11373":740732,"11367":840649,"11378":852922,"11358":866533,"11385":928539,"11104":960033,"11103":1058754,"11354":1061923,"11105":1380747,"11366":1386617,"11106":1681836,"11102":2645035,"11101":5376394}

var bk = {
    'domSelector': '#bk_map',
    'data': bk_data,
    'center': { 'lat': -73.857568, 'lon': 40.657683 }
};

var qn = {
    'domSelector': '#qn_map',
    'data': qn_data,
    'center': { 'lat': -73.69, 'lon': 40.72 }
};

var getMax = function (data) {
    var vals = Object.keys(data)
        .map(function (key) { 
            return data[key]; 
        });

    return Math.max.apply(null, vals);
}


var initializeSVG = function (selector) {
    svg = d3.select(selector)
            .append("svg")
            .attr("class", "RdPu")
            .attr("width", width)
            .attr("height", height);
};


var createMap = function (param, zipcodes) {
    //map type & center point 
    var projection = d3.geo.mercator()
            .center([param.center.lat, param.center.lon])
        .scale(100000);

    var path = d3.geo.path().projection(projection);

    dataMax = getMax(param.data);

    setColor.domain([0, dataMax])

    initializeSVG(param.domSelector);
	svg.append("g")
		.selectAll("path")
		.data(zipcodes.features)
		.enter()
		.append("path")
		.attr('name', function(d) { return d.properties.name })
		.attr('value', function(d) { return param.data[d.id] })
		.attr("title", function(d) { return d.id; })
		.attr("class", function(d) { return zipcodeColor(d.id, param.data); } )
		.attr("stroke", "#fff")
		.attr("d", path);

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

	var step = dataMax / legendSteps;
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
		.attr("y", function(d, i){ return height - (i*legendHeight) - 2*legendHeight; })
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("class", function(d) { return setColor(d); });

	legend.append("text")
		.attr("x", 40 + 2)
		.attr("y", function(d, i){ return height - (i*legendHeight) - 2*legendHeight + 15; })
		.attr("class", "mapSubtext")
		.text(function(d){ return "$ " + numberWithCommas(d);});
};

//set up map
var width = 450;
var height = 450;

var svg;
var zips;
var time;

//legend settings
var dataMax = getMax(bk.data);
var legendWidth = 20;
var legendHeight = 20;
var legendSteps = 9;


//set up a qX-9 number to associate with colorbrew.css styles
var setColor = d3.scale.quantize()
    .domain([0, dataMax])
    .range(d3.range(9).map(function(i) { return "q" + (i) + "-9"; }));


d3.json("static/data/zipcodes.json", function(zipcodes){
    zips = zipcodes;
    createMap(bk, zips);
    createMap(qn, zips);
});

function numberWithCommas(x) {
    x = Math.round(x / 100000) * 100000
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
