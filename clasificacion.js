document.addEventListener('DOMContentLoaded', function() {
    var margin = {top:70, right:20, bottom:30, left:200},
    w = 1000 - margin.left - margin.right,
    h = 800 - margin.top - margin.bottom;

    // var color = d3.scaleOrdinal(d3.schemeCategory10);

    var x = d3.scaleLinear().range([0,w]);
    var y = d3.scaleBand().rangeRound([0,h]).padding(0.1);

    var xAxis = d3.axisTop(x);
    var yAxis = d3.axisLeft(y); 

    var svg = d3.select("#graph").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var selectedSeason = 2024;

    d3.csv("data/premier-tables.csv").then(function(data){
        data.forEach(function(d) {
            d.points = +d.points;
        });

        // Filtra los datos según la temporada seleccionada
        var filteredData = data.filter(function(d) {
            return d.season_end_year == selectedSeason;
        });

        x.domain([0, d3.max(filteredData, function(d) {return d.points})+5]); 
        y.domain(filteredData.map(function(d) {return d.team})); 

        svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

        svg.append("g")
            .attr("class","y axis")
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "end")  
            .style("font-size", "30px")
            .style("font-family", "PremierSans")
            .attr("dx", "-.5em")
            
        svg.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class","bar")
            .attr("x",0)
            .attr("y", function(d) {return y(d.team); })
            .attr("width", function(d) { return x(d.points); })
            .attr("height", 30)
            .attr("fill", "grey");
    });
});