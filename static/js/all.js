// GOOD

// set initial city to Hanoi, Vietnam and radio button to food and drinks
var city = "Hanoi, Viet Nam";
var radioValue = "fnb";

var rangeLabel = "Jan";

$rangeInput = $('.range input')

// Change input value on label click
$('.range-labels li').on('click', function () {

  var index = $(this).index();
  rangeLabel = $(this).text();
    
  $rangeInput.val(index + 1).trigger('input');
  console.log(rangeLabel);

  generate_prcp();
})

function addParagraph() {
  $("#intro1").empty();
  $("#intro2").empty();
  $("#intro3").empty();
  $("#intro4").empty();
  $("#city_label").empty();

  
  var intro_link = "/api/v1.0/intro";

  d3.json(intro_link, (function(error, jsonData) {
    if (error) throw error;

    for (var i = 0; i < jsonData.length; i++) {
      if (jsonData[i]['city_country'] === city) {
        $("#city_label").append(city);
        $("#intro1").append(jsonData[i]['para1']);
        $("#intro2").append(jsonData[i]['para2']);
        $("#intro3").append(jsonData[i]['para3']);
        if (jsonData[i]['para4']==="empty") {
          $("#intro4").empty();
        }
        else {
          $("#intro4").append(jsonData[i]['para4']);
        }
        
      }
    }
  }));
}

function onClick(e) {
  var coords_dp = this.getLatLng();
  var city_lat = coords_dp['lat'];
  var city_lng = coords_dp['lng'];

  var coords_link = "/api/v1.0/coordsData";

  d3.json(coords_link, (function(error, coords_data) {
    if (error) throw error;

    var found_city;
    for(var i = 0; i < coords_data.length; i++) {
      var nn = coords_data[i];
      if (nn.lat == city_lat && nn.lon == city_lng) {
        found_city = nn.city_country;
        city = found_city;
        optionChanged(city);        
      }
    }
  }))
}

//function for initial landing page
function initDashboard() {
    
  tempGauge(city);
  percipGauge(city);
  generateChart();
  generate_prcp();
  addParagraph(city)  
}

var url = "/api/v1.0/climate";

function cityCaller(city) {

  d3.json(url, (function(error, climate) {
    if (error) throw error;
    console.log(climate);

    var city_names = [];
    // Append each ID from the samplesData array to the samplesIDs list.
    climate.forEach((element, index) => {
      city_names.push(element.city_country);
    });

    var city_index = city_names.indexOf(city);
    console.log(city_index);


  }));
}

function tempGauge(city) {
  d3.json(url, (function(error, climate) {
    if (error) throw error;
    // console.log(climate);

    var city_names = [];
    // Append each ID from the samplesData array to the samplesIDs list.
    climate.forEach((element, index) => {
      city_names.push(element.city_country);
    });

    var city_index = city_names.indexOf(city);
    // console.log(city_index);
  
    var myConfig = {
      type: "gauge",
      globals: {
        fontSize: 15
      },
      plotarea: {
        marginTop: 80
      },
      plot: {
        size: '100%',
        valueBox: {
          placement: 'center',
          text: '%v', //default
          fontSize: 15,
          rules: [{
              rule: '%v < 30',
              text: '%v<br>Freezing'
            },
            {
              rule: '%v >= 30 && %v < 60',
              text: '%v<br>Fair'
            },
            {
              rule: '%v >= 60 && %v < 90',
              text: '%v<br>Warm'
            },
            {
              rule: '%v >=  90',
              text: '%v<br>Hot'
            }
          ]
        }
      },
      tooltip: {
        borderRadius: 5
      },
      scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 120,
        step: 15,
        center: {
          visible: false
        },
        tick: {
          visible: false
        },
        item: {
          offsetR: 0,
          rules: [{
            rule: '%i == 9',
            offsetX: 15
          }]
        },

        ring: {
          size: 50,
          rules: [{
              rule: '%v < 30',
              backgroundColor: '#0B94FF'
            },
            {
              rule: '%v >= 30 && %v < 60',
              backgroundColor: '#0BFFC0'
            },
            {
              rule: '%v >= 60 && %v < 90',
              backgroundColor: '#FFA60B'
            },
            {
              rule: '%v >=  90',
              backgroundColor: '#FF290B'
            }
          ]
        }
      },
      refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 1500,
        resetTimeout: 1000
      },
      series: [{
        values: [climate[city_index].avg_temp],
        backgroundColor: 'black',
        indicator: [5, 1, 5, 1, .2],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900
        },
      }]
    };
  
    zingchart.render({
      id: 'tempGauge',
      data: myConfig,
      height: 500,
      width: '100%'
    });
  }));
}

function percipGauge(city) {
  d3.json(url, (function(error, climate) {
    if (error) throw error;
    // console.log(climate);

    var city_names = [];
    // Append each ID from the samplesData array to the samplesIDs list.
    climate.forEach((element, index) => {
      city_names.push(element.city_country);
    });

    var city_index = city_names.indexOf(city);
    // console.log(city_index);
    var myConfig = {
      type: "gauge",
      globals: {
        fontSize: 15
      },
      plotarea: {
        marginTop: 80
      },
      plot: {
        size: '100%',
        valueBox: {
          placement: 'center',
          text: '%v', //default
          fontSize: 15,
          rules: [{
              rule: '%v < 2',
              text: '%v<br>Little to No Rain'
            },
            {
              rule: '%v >= 2 && %v < 4',
              text: '%v<br>Light Rain'
            },
            {
              rule: '%v >= 4 && %v < 6',
              text: '%v<br>Moderate Rain'
            },
            {
              rule: '%v >=  6',
              text: '%v<br>Heavy Rain'
            }
          ]
        }
      },
      tooltip: {
        borderRadius: 5
      },
      scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 10,
        step: 2.5,
        center: {
          visible: false
        },
        tick: {
          visible: false
        },
        item: {
          offsetR: 0,
          rules: [{
            rule: '%i == 9',
            offsetX: 15
          }]
        },

        ring: {
          size: 50,
          rules: [{
              rule: '%v < 2',
              backgroundColor: '#0BFF85'
            },
            {
              rule: '%v >= 2 && %v < 4',
              backgroundColor: '#0BFFF8'
            },
            {
              rule: '%v >= 4 && %v < 6',
              backgroundColor: '#0BD6FF'
            },
            {
              rule: '%v >=  6',
              backgroundColor: '#0B94FF'
            }
          ]
        }
      },
      refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 1500,
        resetTimeout: 1000
      },
      series: [{
        values: [climate[city_index].precipitation],
        backgroundColor: 'black',
        indicator: [5, 1, 5, 1, .2],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900
        },
      }]
    };
      
    zingchart.render({
      id: 'precGauge',
      data: myConfig,
      height: 500,
      width: '100%'
    });
  }));
}

function generate_prcp() {
  var sheet = document.createElement('style'),  
    $rangeInput = $('.range input'),
    prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

  document.body.appendChild(sheet);

  var getTrackStyle = function (el) {  
    var curVal = el.value,
        val = (curVal - 0.985) * 8.868,
        style = '';
    
    // Set active label
    $('.range-labels li').removeClass('active selected');
    
    var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
    
    curLabel.addClass('active selected');
    curLabel.prevAll().addClass('selected');
    
    // Change background gradient
    for (var i = 0; i < prefs.length; i++) {
      style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
      style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
    }

    return style;
  }

  $rangeInput.on('input', function () {
    sheet.textContent = getTrackStyle(this);
  });

  // // Change input value on label click
  // $('.range-labels li').on('click', function () {

  //   var index = $(this).index();
  //   rangeLabel = $(this).text();
      
  //   $rangeInput.val(index + 1).trigger('input');
  //   console.log(rangeLabel);

  var data_link = "/api/v1.0/tempPrcp";

  d3.json(data_link, (function(error, jsonData) {
    if (error) throw error;

    dps = jsonData[city];

    // console.log(dps);

    for (var i = 0; i < dps.length; i++) {
      // console.log(dps[i].month);
      if (rangeLabel === dps[i].month) {
        // console.log(`${dps[i].month}: ${dps[i].volume}`);
        var datapoints = dps[i].volume;
        var high_temp = dps[i].temp[0];
        var lo_temp = dps[i].temp[1];
        // console.log(lo_temp);
        // console.log(high_temp);
        break
      }
    }

    const dataSource = {
      chart: {
        caption: `Average Precipitation in ${city} during the month of ${rangeLabel}`,
        lowerlimit: "0",
        upperlimit: "15",
        numbersuffix: " in.",
        cylfillcolor: "#29ADDC",
        plottooltext: `Precipitation: <b> ${datapoints} in. </b>`,
        cylfillhoveralpha: "85",
        showValue: "1",
        animationDuration: "2",
        showBorder: "1",
        bgColor: "#ffffff",
        theme: "fusion"
      },
      value: datapoints
    };
    
    FusionCharts.ready(function() {
      var myChart = new FusionCharts({
        type: "cylinder",
        renderAt: "chart-container",
        width: "100%",
        height: "100%",
        dataFormat: "json",
        dataSource
      }).render();
    });

    FusionCharts.ready(function() {
      var myChart1 = new FusionCharts({
        type: 'thermometer',
        renderAt: 'lo-temp',
        id: 'myThm',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
          "value": lo_temp,
          "chart": {
            "theme": "fusion",
            "caption": `Low Temperature in ${city} during the month of ${rangeLabel}`,
            "subcaption": " (on average)",
            "lowerLimit": "0",
            "upperLimit": "110",
            "showvalue": "1",
            "decimals": "0",
            "numberSuffix": "°F",
            "showhovereffect": "1",
            "thmFillColor": "#29ADDC",
            "showGaugeBorder": "1",
            "gaugeBorderColor": "#008ee4",
            "gaugeBorderThickness": "2",
            "gaugeBorderAlpha": "30",
            "valueFontColor": "#000000",
            "showBorder": "1",
            "bgColor": "#ffffff",
            "animationDuration": "2",
            "theme": "gammel"
          }
        }
      }).render();
    });

    FusionCharts.ready(function() {
      var myChart2 = new FusionCharts({
        type: 'thermometer',
        renderAt: 'hi-temp',
        id: 'myThm2',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            "theme": "fusion",
            "caption": `High Temperature in ${city} during the month of ${rangeLabel}`,
            "subcaption": " (on average)",
            "lowerLimit": "0",
            "upperLimit": "110",
            "showvalue": "1",
            "decimals": "0",
            "numberSuffix": "°F",
            "showhovereffect": "1",
            "thmFillColor": "#29ADDC",
            "showGaugeBorder": "1",
            "gaugeBorderColor": "#008ee4",
            "gaugeBorderThickness": "2",
            "gaugeBorderAlpha": "30",
            "valueFontColor": "#000000",
            "showBorder": "1",
            "bgColor": "#ffffff",
            "animationDuration": "2",
            "theme": "gammel"
          },
          "value": high_temp
        }
      }).render();
    });    

  }));
}

function generateChart () {
  var data_link = "/api/v1.0/" + radioValue +"Data";
  
  d3.json(data_link, (function(error, jsonData) {
      if (error) throw error;
      // console.log(radio.value, ":", jsonData);

      var dataPoints1 = [];
      var chart1 = new CanvasJS.Chart("chartContainer1", {
          theme: "light2",
          animationEnabled: true,
          title:{
              // text:'Showing Price Range for {y}',
              padding: 10,
              margin: 20,
              fontSize: 20,
              wrap: true,
          },
          axisX: {
          interval: 1,
          labelFontSize: 12,
          labelAutoFit: true,
          labelAngle: 0
          },
          axisY:{
          title: "Price Range",
          titleFontSize: 20,
          titleFontWeight: "bold",
          labelFontSize: 14,
          valueFormatString: "$#0.00"
          },
          data: [{
              type: "rangeColumn",
              indexLabel: "{y[#index]}",
              indexLabelFontSize: 10,
              yValueFormatString: "$#0.00",
              toolTipContent: "{label}<br>High: {y[1]}<br>Low: {y[0]}",
              dataPoints: dataPoints1
          }]
      });
  
      // select data based on selected drop-down option
      chart1.options.data[0].dataPoints = [];

      // var selected = e.options[e.selectedIndex].value;
      dps = jsonData[city];
      
      // console.log(city);

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

      // pushing data in to datapoints list
      for(var i = 0; i < dps.length; i++) {
          y_value = [];
          y_value.push(dps[i].y[0]);
          y_value.push(dps[i].y[1]);
          // console.log(y_value);
          chart1.options.data[0].dataPoints.push({label: dps[i].label, y: y_value});
      }

      chart1.render();
  }))
  
}

function OnChangeRadio (radio) {
  radioValue = radio.value;  
  generateChart();
  // console.log(radio.value)
}

// on change function
function optionChanged(newCity) {
  console.log(`New city is picked: ${newCity}`);
  console.log(`Showing data for ${newCity}`)
  generateChart();
  tempGauge(newCity);
  percipGauge(newCity);
  generate_prcp();
  addParagraph(newCity);
}

// call initial landing page function to get landing page to display
initDashboard();
