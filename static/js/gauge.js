/////////////////
//Henock's Code//
/////////////////

var url = "/climate";

// // D3 select the html ID where the data will be placed.
// var locationName = d3.select("#selLocDataset");
// var monthName = d3.select("#selMonDataset")
// // Pull the selection from the value element and pass it into a variable.
// var locationDataSet = locationName.property("locValue");
// var monthDataSet = monthName.property("monValue");


d3.json(url).then(function(climate) {
    console.log(climate);

    climateLocation = [];
    climateMonth = [];

    for (var i=0; i < climate.length; i++) {
        climateLocation.push(climate[i].city_country);
        climateMonth.push(climate[i].month);
    };

    console.log(climateLocation);
    console.log(climateMonth);

    // Since there are multiple months of the same location, initialize with Jan

    // // Get the index of the ID selection.
    // var locationIndex = climateLocation.indexOf(locationDataSet);
    // var monthIndex = climateMonth.indexOf(monthDataSet);



    function tempHiGauge(climateData) {

    }

    function tempLoGauge(climateData) {

    }

    function percipGauge(climateData) {
        
    }

    function createGaugeDropDown(climateData) {
        // D3 select the html ID where the data will be placed.
        var dropdownMenu = d3.select("#selDataset");
        // Iterate trhough the ID list and append each ID to the dropdownMenu.
        samples.forEach((x) => {
            dropdownMenu
            .append("option")
            .text(x)
            .property("value", x);
        });
    }

    function initGauge() {
        tempLoGauge(climateData);
        tempHiGauge(climateData);
        percipGauge(climateData);
        createGaugeDropDown(climateData);

    }
    // initGauge(); 

    function updateCharts(climateData) {
        
    }

});
