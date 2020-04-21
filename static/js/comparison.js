// Show that we've loaded the JavaScript file
// console.log("Loaded comparison.js");

// Query the endpoint that returns a JSON ...
var comparison = "/api/v1.0/comparison";

d3.json(comparison, (function(error, jsonData) {
    if (error) throw error;
    // console.log("Comparison Data:", jsonData);
    
    var dataPoints = [];

    var dataPoints1 = [];
    var chart1 = new CanvasJS.Chart("chartContainer1", {
        theme: "light2",
        animationEnabled: true,
        title:{
            text:"Top 20 Countries (ranked by cheapest to more expensive)",
            padding: 10,
            margin: 20,
            fontSize: 20,
            wrap: true,
        },
        axisX: {
        interval: 1,
        labelAngle: -90,
        labelFontSize: 14
        },
        axisY:{
        // interlacedColor: "rgba(1,77,101,.2)",	
        // gridColor: "rgba(1,77,101,.1)",
        title: "Price Range",
        titleFontSize: 20,
        titleFontWeight: "bold",
        labelFontSize: 14,
        valueFormatString: "$#0.00"
        },
        data: [{
            type: "rangeColumn",
            indexLabel: "{y[#index]}",
            indexLabelFontSize: 12,
            yValueFormatString: "$#0.00",
            toolTipContent: "{label}<br>High: {y[1]}<br>Low: {y[0]}",
            dataPoints: dataPoints1
        }]
    });

    var dataPoints2 = [];
    var chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title:{
            text: "Overall View (ranked by cheapest to more expensive)",
            padding: 10,
            margin: 20,
            fontSize: 20,
            wrap: true,
        },
        axisX: {
            labelAngle: -90,
            labelFontSize: 12,
            interval: 3,
            },
        axisY: {
            title: "Lowest Price Range",
            titleFontSize: 20,
            titleFontWeight: "bold",
            labelFontSize: 14,
            valueFormatString: "$#0.#00"
        },
        data: [{        
            type: "column",  
            // showInLegend: true,
            yValueFormatString: "$#0.00",
            toolTipContent: "{label}<br>Lowest Price Range: {y}",
            dataPoints: dataPoints2
        }]
    });

    // select data based on selected drop-down option
    $( ".dropdown" ).change(function() {
        chart1.options.data[0].dataPoints = [];
        chart2.options.data[0].dataPoints = [];
        var e = document.getElementById("dd");
        var selected = e.options[e.selectedIndex].value;
        dps = jsonData[selected];
        dps.sort(function(a,b) {return a.y[0]-b.y[0]});

        // console.log(dps);

        // fix flipped low and high values and put it in the right order
        for (var i = 0; i < dps.length; i++) {
            if (dps[i].y[0] > dps[i].y[1]) {
                // console.log(`low price: ${dps[i].y[0]}`);
                // console.log(`high price: ${dps[i].y[1]}`);
                dps[i].y.push(dps[i].y[0])
                // console.log(`high price: ${dps[i].y[2]}`);
                dps[i].y.shift(dps[i].y[0]);
                // console.log(dps[i].y);
            };
        }

        ///////////////////////////////////////
        // RANGE COLUMN CHART DATA
        ///////////////////////////////////////


        // create a list to store only the top 20 cities
        var chart_data = [];
        
        // set the counter to 20
        var counter = 20

        // add the counter by one if null value is found so that data can be pulled for exactly 20 cities
        for (var i = 0; i < dps.length; i++) {  
            if (dps[i].y[1] === null) {
                counter += 1
            };
        }

        // check counter to make sure the addition works correctly
        // console.log(counter)

        // store data in the new chart_data list and sort the data based on lower price range
        for (var i = 0; i < counter; i++) {
            if (dps[i].y[1] > 0) {
                chart_data.push(dps[i]);
                chart_data.sort(function(a,b) {return a.y[0]-b.y[0]});
            };
        }

        // check if data are pulled in correctly
        // console.log(chart_data)

        // pushing data in to datapoints list
        for(var i = 0; i < chart_data.length; i++) {
            y_value = [];
            y_value.push(chart_data[i].y[0]);
            y_value.push(chart_data[i].y[1]);
            // console.log(y_value);
            chart1.options.data[0].dataPoints.push({label: chart_data[i].label, y: y_value});
        }

        chart1.render();

        ///////////////////////////////////////
        // BAR CHART DATA
        ///////////////////////////////////////

        // pushing data in to datapoints list
        for(var i = 0; i < dps.length; i++) {
            if (dps[i].y[1] > 0) {
                dps.sort(function(a,b) {return a.y[0]-b.y[0]});
                y_value = dps[i].y[0];
                // console.log(y_value);
                chart2.options.data[0].dataPoints.push({y: y_value, label: dps[i].label});
            }
        }

        

        // for(var i in dps) {
        //     var xVal = dps[i].x;
        //     chart2.options.data[0].dataPoints.push({x: dps[i].x, y: dps[i].y[0]});
        // }

        chart1.render();
        chart2.render();
    })
}));
