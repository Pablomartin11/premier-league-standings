var RadarChart = {
    draw: function(id, d, options){
      var cfg = {
       radius: 8,
       w: 300,
       h: 300,
       factor: 1,
       factorLegend: 1,
       levels: 1,
       maxValue: 0,
       radians: 2 * Math.PI,
       opacityArea: 0.5,
       ToRight: 5,
       TranslateX: 80,
       TranslateY: 80,
       ExtraWidthX: 300,
       ExtraWidthY: 300,
       color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
      };
      
      if('undefined' !== typeof options){
        for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
        }
      }
      
      // Función para obtener los maximos en todas las columnas que serán ejes
      calculateMaxValue().then(function(maxValue) {
      
      var allAxis = (d[0].map(function(i, j){return i.area}));
      var total = allAxis.length;
      var radius = Math.min(cfg.w/2, cfg.h/2);
      d3.select(id).select("svg").remove();
  
      var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        g.append("text")
        .attr("x", (cfg.w / 2))             
        .attr("y", -cfg.TranslateY / 2-30)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")
        .style("font-family", "aptos") 
        .style("font-weight", "bold")
        .text("Rendimiento en temporada");

		var tooltip;
      
      //Circular segments
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
         .data(allAxis)
         .enter()
         .append("svg:line")
         .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
         .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
         .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
         .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
         .attr("class", "line")
         .style("stroke", "grey")
         .style("stroke-opacity", "0.75")
         .style("stroke-width", "0.3px")
         .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
      }
  
      //Text indicating at what % each level is
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
         .data([1]) //dummy data
         .enter()
         .append("svg:text")
         .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
         .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
         .attr("class", "legend")
         .style("font-family", "sans-serif")
         .style("font-size", "10px")
         .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
         .attr("fill", "#737373")
         .text((j+1)*100/cfg.levels);
      }
  
      series = 0;
  
      var axis = g.selectAll(".axis")
          .data(allAxis)
          .enter()
          .append("g")
          .attr("class", "axis");
  
      axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
        .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "2px");
  
      axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-family", "aptos")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.5em")
        .attr("transform", function(d, i){return "translate(0, -10)"})
        .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
        .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
  
   
      d.forEach(function(y, x){
        dataValues = [];
        g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        });
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
               .data([dataValues])
               .enter()
               .append("polygon")
               .attr("class", "radar-chart-serie"+series)
               .style("stroke-width", "2px")
               .style("stroke", cfg.color(series))
               .attr("points",function(d) {
                 var str="";
                 for(var pti=0;pti<d.length;pti++){
                   str=str+d[pti][0]+","+d[pti][1]+" ";
                 }
                 return str;
                })
               .style("fill", function(j, i){return cfg.color(series)})
               .style("fill-opacity", cfg.opacityArea)
               .on('mouseover', function (d){
                        z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", 0.1); 
                        g.selectAll(z)
                         .transition(200)
                         .style("fill-opacity", .7);
                        })
               .on('mouseout', function(){
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", cfg.opacityArea);
               });
        series++;
      });
      series=0;
  
  
  var tooltip = d3.select("body").append("div").attr("class", "toolTip");
      d.forEach(function(y, x){
        g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue[i])*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/maxValue[i])*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/maxValue[i])*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){return j.area})
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series)).style("fill-opacity", .9)
        .on('mouseover', function (event,d){
          console.log(d);
          console.log(d.area)
              tooltip
                .style("left", event.pageX - 40 + "px")
                .style("top", event.pageY - 80 + "px")
                .style("font-family", "aptos")
                .style("display", "inline-block")
                        .html((d.area) + "<br><b>" + (d.value) + "</b>");
              })
              .on("mouseout", function(d){ tooltip.style("display", "none");});
  
        series++;
      });
    });
      }
  };

  function calculateMaxValue() {
    return d3.csv("/data/premier-tables.csv").then(function(data) {
        var maxValues = {
            won: 0,
            drawn: 0,
            gf: 0,
            ga: 0,
            points: 0
        };

        data.forEach(function(row) {
            maxValues.won = Math.max(maxValues.won, +row.won);
            maxValues.drawn = Math.max(maxValues.drawn, +row.drawn);
            maxValues.gf = Math.max(maxValues.gf, +row.gf);
            maxValues.ga = Math.max(maxValues.ga, +row.ga);
            maxValues.points = Math.max(maxValues.points, +row.points);
        });

        return [maxValues.won, maxValues.drawn, maxValues.gf, maxValues.ga, maxValues.points];
    });
}