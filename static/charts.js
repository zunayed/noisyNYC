d3.csv('static/data/top_complaints.csv')
    .row(function(d) {

        var new_d = {

			complaint: d['Complaint Type'],
            count: +d['Count']
		};
    	return new_d;
    })
	.get(function(error, rows) {

        var w = 1000;
        var h = 600;
        var padding = 50;
        var maxDomain = d3.max(rows, function (d) { return d.count; });
        var minDomain = d3.min(rows, function (d) { return d.count; });

        //scales
        var complaintCountScale = d3.scale.linear();
        var yAxisScale = d3.scale.linear();
        var xAxisScale = d3.scale.ordinal();
        var color = d3.scale.category20c();

        //set up domain and range of scales
        xAxisScale
            .domain(rows.map(function (d) { return d.complaint; }))
            .rangePoints([0, w - w/rows.length]);
            
        complaintCountScale
            .domain([minDomain, maxDomain + 800])
            .range([20, h]);

         yAxisScale
            .domain([maxDomain + 800, minDomain])
            .range([20, h]);

        //pass in scales to axis(s)
        var yAxis = d3.svg.axis()
                  .scale(yAxisScale)
                  .orient("left")
                  .ticks(10);

        var xAxis = d3.svg.axis()
                    .scale(xAxisScale)
                    .orient("bottom");

        //create svg element    
        var svg = d3.select('#d3_chart')
                .append('svg')
                .attr('w', w)
                .attr('h', h);

        svg.selectAll('rect')
            .data(rows)
            .enter()
            .append('rect')
                .attr({
                    x: function (d, i) { return i * (w/rows.length) + padding; },
                    y: function (d, i) { return h - complaintCountScale(d.count); },
                    width: function (d, i) { return (w / rows.length) - 2; },
                    height: function (d, i) { return complaintCountScale(d.count); },
                    fill: function(d, i) { return color(i); }
                });

        svg.selectAll('text')
            .data(rows)
            .enter()
            .append('text')
                .text(function (d) { return d.count; })
                .attr({
                    x: function (d, i) { return i * (w / rows.length) + padding; },
                    y: function (d, i) { return h - complaintCountScale(d.count) + 10; },
                    'front-family': 'helvetica',
                    'font-size' : '11px',
                    'text-anchor' : 'right',
                    'fill': 'white'
                });       

        //appending x & y scales to the SVG element 
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + "," + h + ")")
            .call(xAxis)
                .selectAll("text")  
                .style("text-anchor", "end")
                .attr("transform", function(d) { return "rotate(-65)" });
    });