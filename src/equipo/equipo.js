document.addEventListener('DOMContentLoaded', function() {
    var margin = {top: 70, right: 20, bottom: 30, left: 200},
        w = 800 - margin.left - margin.right,
        h = 800 - margin.top - margin.bottom;

    

    //////////////////////////////////////////////////////////////////////////

    // Manejador para evento de cambio de temporada
    // Actualiza el select de equipos
    function onChangeSeason() {
        var selectedSeason = document.getElementById("seasonInput").value;

        d3.csv("/data/premier-tables.csv").then(function(data) {
            data.forEach(function(d) {
                d.points = +d.points;
            });

            // Filtra los datos según la temporada seleccionada
            var filteredData = data.filter(function(d) {
                return d.season_end_year == selectedSeason;
            });

            // Actualiza el select con los equipos
            var teamSelect = document.getElementById("teamSelect");
            teamSelect.innerHTML = '<option value="" disabled selected>Seleccione un equipo</option>'; // Clear existing options and add default


            filteredData.forEach(function(d) {
                var option = document.createElement('option');
                option.value = d.team;
                option.textContent = d.team;
                teamSelect.appendChild(option);
            });
        });
    }

    // Manejador para evento de cambio de equipo del select
    function onChangeTeam() {
        document.getElementById("teamTitle").textContent = document.getElementById("teamSelect").value;

        var data = [
            [
                {axis: "strength", value: 80}, 
                {axis: "intelligence", value: 6}, 
                {axis: "charisma", value: 5},  
                {axis: "dexterity", value: 9},  
                {axis: "luck", value: 2}
            ]
        ];
    
        var config = {
            w: w,
            h: h,
            maxValue: 100,
            levels: 5,
            ExtraWidthX: 300
        }
    
        RadarChart.draw("#graph2", data, config);
    }
    
    // Inicializa la página con los datos por defecto
    function init() {
        onChangeSeason();
    }
    

    init();
    // Eventos
    document.getElementById("seasonInput").addEventListener('input', onChangeSeason);
    document.getElementById("teamSelect").addEventListener('input', onChangeTeam);
});

