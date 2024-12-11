document.addEventListener('DOMContentLoaded', function() {
    var margin = {top: 70, right: 20, bottom: 30, left: 200},
        w = 600 - margin.left - margin.right,
        h = 600 - margin.top - margin.bottom;

    

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
        var selectedSeason = document.getElementById("seasonInput").value;
        var selectedTeam = document.getElementById("teamSelect").value;

        fetchData().then(function(data) {
            var filteredData = data.filter(function(d) {
                return d.season_end_year == selectedSeason && d.team == selectedTeam;
            });        
        console.log(filteredData);
        var data = [
            [
                {"area": "Won", "value": filteredData[0].won}, 
                {"area": "Drawn", "value": filteredData[0].drawn}, 
                {"area": "Goals Forward", "value": filteredData[0].gf},  
                {"area": "Goals Allowed", "value": filteredData[0].ga},  
                {"area": "Points", "value": filteredData[0].points}
            ]
        ];
    
        var config = {
            w: 500,
            h: 500,
            maxValue: filteredData[0].maxValue,
            levels: 4,
            ExtraWidthX: 200
        }
    
        RadarChart.draw("#graph2", data, config);

        // Actualizo el logo del equipo
        var teamTitle = filteredData[0].team;
        console.log(teamTitle);
        var logoPath = "/public/" + teamTitle + ".png"; // Adjust the path as needed
        document.getElementById("teamLogo").src = logoPath;
    });
    }
    
    // Inicializa la página con los datos por defecto
    function init() {
        onChangeSeason();
    }
    

    init();
    // Eventos
    document.getElementById("seasonInput").addEventListener('input', onChangeSeason);
    document.getElementById("teamSelect").addEventListener('input', onChangeTeam);

    // Función para obtener los datos del equipo seleccionado
    function fetchData() {
        return d3.csv("/data/premier-tables.csv").then(function(data) {
            data.forEach(function(d) {
                d.won = +d.won;
                d.drawn = +d.drawn;
                d.gf = +d.gf;
                d.ga = +d.ga;
                d.points = +d.points;
            });
            return data;
        });
    }

});






