d3.csv("top_complaints.csv")
    .row(function(d) {

		var new_d = {

			complaint_type: d['Complaint Type'],
			
			count: +d['Count']
		};

    	return new_d;

    })
	.get(function(error, rows) {

        var rows = rows.reverse();

        var w = 1000;
        var h = 600;

        var complaintCountScale = d3.scale.linear();

        var maxDomain = d3.max(rows, function (d) {
            return d.count;
        });

        var minDomain = d3.min(rows, function (d) {
            return d.count;
        });

        complaintCountScale
            .domain([minDomain, maxDomain])
            .range([h*.05, h*.9]);

        var svg = d3.select('.d3_chart')
                .append('svg')
                .attr('w', w)
                .attr('h', h);

        svg.selectAll('rect')
            .data(rows)
            .enter()
            .append('rect')
                .attr('x', function (d, i) {
                    return i * (w/rows.length);
                })
                .attr('y', function (d, i) {
                    return h - complaintCountScale(d.count);
                    
                })
                .attr('width', function (d, i) {
                    return (w / rows.length) - 2;
                })
                .attr('height', function (d, i) {
                    return complaintCountScale(d.count); 
                })
                .attr('fill', function (d, i) {
                    // var color = ['rgb', '(', i*20, ',', i*10, ',', i*10,')'].join('');
                    // return color;
                    return "black";
                });


        svg.selectAll('text')
            .data(rows)
            .enter()
            .append('text')
                .attr('y', function (d, i) {
                    return h - complaintCountScale(d.count);
                })
                .attr('x', function (d, i) {
                    return i * (w / rows.length);
                })
                .attr('fill', 'blue')
                .text(function (d) {
                    return d.count;
                });






    });