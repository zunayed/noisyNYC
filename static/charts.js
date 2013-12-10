d3.csv("top_complaints.csv")
    .row(function(d) { return {key: d.key, value: +d.value}; })
    .get(function(error, rows) { console.log(rows); });