document.addEventListener('DOMContentLoaded', function() {
    var margin = {top:70, right:30, bottom:30, left:240},
    w = 1150 - margin.left - margin.right,
    h = 800 - margin.top - margin.bottom;

    // var color = d3.scaleOrdinal(d3.schemeCategory10);

    var x = d3.scaleLinear().range([0,w]);
    var y = d3.scaleBand().rangeRound([0,h]).padding(0.1);

    var xAxis = d3.axisTop(x)
        .ticks(10)
        .tickSize(0);
    var yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(25); 

    var svg = d3.select("#graph").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    var selectedSeason = 2024;
    drawBarChart(selectedSeason);

    

    function onChangeSeason(){
        var selectedSeason = document.getElementById("verticalSlider").value;
        document.getElementById("seasonNumber").innerHTML = parseInt(selectedSeason)-1 + "/" + selectedSeason;
        drawBarChart(selectedSeason);
    }

    function drawBarChart(selectedSeason){
        d3.csv("/data/premier-tables.csv").then(function(data){
            data.forEach(function(d) {
                d.points = +d.points;
            });
    
            // Filtra los datos según la temporada seleccionada
            var filteredData = data.filter(function(d) {
                return d.season_end_year == selectedSeason;
            });
    
            x.domain([0, d3.max(filteredData, function(d) {return d.points})+5]); 
            y.domain(filteredData.map(function(d) {return d.team})); 

            // Borra todo el contenido del svg antes de redibujar
            svg.selectAll("*").remove();
    
            // Grid Vertical
            svg.selectAll("line.vertical-grid")
            .data(x.ticks(10))
            .enter()
            .append("line")
            .attr("class", "vertical-grid")
            .attr("x1", function(d) { return x(d); })
            .attr("x2", function(d) { return x(d); })
            .attr("y1", 0)
            .attr("y2", h)
            .style("stroke", "#ccc")
            .style("stroke-width", "2px")
            .style("stroke-dasharray", ("3, 3"));
    
            // Eje X
            svg.append("g")
            .attr("class", "x axis")
            .style("font-size", "15px")
            .call(xAxis)
            .call(g => g.select(".domain").remove());
                
            // Barras
            svg.selectAll(".bar")
                .data(filteredData)
                .enter().append("rect")
                .attr("class","bar")
                .attr("x",0)
                .attr("y", function(d) {return y(d.team); })
                .attr("width", function(d) { return x(d.points); })
                .attr("height", y.bandwidth())
                .attr("fill", function(d){
                    if (d.notes.includes("Champions")){
                        return "#3562A6";
                    } else if (d.notes == "Relegated"){ 
                        return "red";
                    } else if(d.notes.includes("Europa Conference")){
                        return "#00be14";
                    } 
                    else if(d.notes.includes("Europa League")){
                        return "#fd7000";
                    } else {
                        return "#00FF85";
                    }
                })
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html(d.team + "<br/>" + d.points + " puntos" + "<br/><b>" + d.notes + "</b>")
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
    
            // Eje Y
            svg.append("g")
            .attr("class","y axis")
            .style("font-size", "18px")
            .call(yAxis)
            .selectAll("path")
            .style("stroke-width", "4px");
    
            svg.selectAll(".y.axis .tick text")
            .text(function(d) {
                return d.toUpperCase();
            });
    
            svg.selectAll(".label")
            .data(filteredData)
            .enter().append("text")
            .attr("x", function(d) { return x(d.points) + 10; })
            .attr("y", function(d) { return y(d.team) + y.bandwidth() / 2; })
            .attr("dy", ".35em")
            .style("font-size", "20px")
            .style("font-family", "aptos")
            .style("font-weight", "bold")
            .style("fill", "black")
            .text(function(d) { return d.points; });
    
            svg.append("text")
            .attr("transform", "translate(" + (margin.left - 435) + " ," + (margin.top - 120) + ")")
            .style("text-anchor", "start")
            .style("font-size", "20px")
            .style("font-family", "aptos")
            .style("font-weight", "bold")
            .text("Clasificación final de los equipos Premier League");
        });
    }

    document.getElementById("verticalSlider").addEventListener("input", onChangeSeason);
});