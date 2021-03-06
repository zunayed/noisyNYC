/*global d3: false  */

// TODO
// Legend
// Transition
// jquery cookie
// static reorg 

var dataSets = {
  "noise": {
    "data": 'static/data/all_noise_counts.csv',
    "maxDomain": 915
  },
  "heat": {
    "data": 'static/data/all_heat_counts.csv',
    "maxDomain": 3000
  },
};

var width = 960;
var height = 150;
var cellSize = 17; // cell size

var day = d3.time.format("%w");
var week = d3.time.format("%U");
var percent = d3.format(".1%");
var format = d3.time.format("%Y-%m-%d");
var color = d3.scale.quantize()
  .domain([0, 915])
  .range(d3.range(9).map(function (d) { return "q" + d + "-9"; }));

var svg = d3.select("#charts").selectAll("svg")
  .data(d3.range(2012, 2015))
  .enter()
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "BuGn")
  .append("g")
  .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
  .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
  .style("text-anchor", "middle")
  .text(function (d) { return d; });

var days_list = ['M', 'W', 'F'];
var dayLabel = svg.selectAll(".dayLebl")
  .data(days_list)
  .enter().append("text")
  .text(function (d) { return d; })
  .attr("y", function (d, i) { return i * cellSize * 2 + 30; })
  .attr("x", 920)
  .style("text-anchor", "middle");

var times_list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
var timeLabels = svg.selectAll(".timeLabel")
  .data(times_list)
  .enter()
  .append("text")
  .text(function (d) { return d; })
  .attr("x", function (d, i) { return i * (width / 12) + 5; })
  .attr("y", -5)
  .style("text-anchor", "middle");
    // .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    // .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var mouseover = function () {
  var text = d3.select(this).text();

  d3.select("#tooltip")
    .html(text)
    .transition()
    .duration(100)
    .style("stroke-width", "4px")
    .style("left", d3.event.pageX + 10 + "px")
    .style("top", d3.event.pageY + 10 + "px")
    .style("opacity", 1);
};

var mouseout = function () {
  d3.select("#tooltip")
    .transition()
    .duration(100)
    .style("stroke-width", "1px")
    .style("opacity", 0);
};

var rect = svg.selectAll(".day")
  .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
  .attr("class", "day")
  .attr("width", cellSize)
  .attr("height", cellSize)
  .attr("x", function (d) { return week(d) * cellSize; })
  .attr("y", function (d) { return day(d) * cellSize; })
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .datum(format);

svg.selectAll(".month")
  .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
  .attr("class", "month")
  .attr("d", monthPath);

function plotData(csv_file) {
  d3.csv(csv_file, function (csv) {
  var key_val = {};

  for (var i = csv.length - 1; i >= 0; i--) {
    key_val[csv[i]['Created Date']] = csv[i]['Complaint Type'];
  }

  rect.filter(function(d) { return d in key_val; })
    .attr("class", function(d) { return "day " + color(key_val[d]); })
    .text(function(d) { return d + ": " + key_val[d]; });
  });
}

function plotLegend(max_domain) {
  //legend settings
  var dataLegendMax = max_domain;
  var legendWidth = 15;
  var legendHeight = 15;
  var legendSteps = 9;

  var step = dataLegendMax / legendSteps;
  var legendRange = [];

  for (var k = 0 ; k < legendSteps ; k++) {
    legendRange.push (Math.floor(k * step));
  }
  var legend_svg = d3.select("#legend")
    .append("svg")
    .attr("class", "BuGn")
    .attr("width", 960)
    .attr("height", 80 );

  var legend = legend_svg.selectAll("g.legend")
    .data(legendRange)
    .enter().append("g")
    .attr("class", "legend");

  legend.append("rect")
    .attr("x", function(d, i){ return (i * legendHeight) + 30; })
    .attr("y", 20)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("class", function(d) { return "day " + color(d); });

  legend_svg.append("text")
    .attr("x", 30)
    .attr("y", 18)
    .attr("class", "mapSubtext")
    .text('Legend');

  legend_svg.append("text")
    .attr("x", 30)
    .attr("y", legendHeight * 3 + 5)
    .attr("class", "mapSubtext")
    .text('0');

  legend_svg.append("text")
    .attr("x", legendSteps * legendHeight + 30)
    .attr("y", legendHeight * 3 + 5)
    .attr("class", "mapSubtext")
    .text(dataLegendMax);
}

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

//monitor dropdown menu to change data
d3.select("#dataSelector").on("change", function() {
  currentData = dataSets[this.value];
  color.domain([0, dataSets[this.value]['maxDomain']])
  plotData(dataSets[this.value]['data']);
});

// plot the default dataset
plotData(dataSets['noise']['data']);
plotLegend(915);
