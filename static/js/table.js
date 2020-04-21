// var button = d3.select("#table_button");
var linkFacts = "/api/v1.0/facts";

function tableFromJson() {
    d3.json(linkFacts, (function(error, facts) {
        if (error) throw error;
        
        // check if data are stored correctly
        // console.log(facts);
        
        // Extract value from table header. 
        var col = ["city_country", "rank", "daily_total_value", "population", "metro", "currency", "airport", "timezone"];

        // Create a table.
        var table = document.createElement("table");
        table.setAttribute('class', 'table table-striped table-condensed');
        table.setAttribute('style', 'font-size: small')

        // Create table header row using the extracted headers above.
        var tr = table.insertRow(-1);                   // table row.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (var i = 0; i < facts.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = facts[i][col[j]];
            }
        }

        // Now, add the newly created table with json data, to a container.
        var divShowData = document.getElementById('showData');
        // divShowData.innerHTML = "";
        divShowData.appendChild(table);

        

        // Rename the columns
        document.getElementsByTagName("th")[0].childNodes[0].nodeValue = "City and Country"
        document.getElementsByTagName("th")[1].childNodes[0].nodeValue = "Rank"
        document.getElementsByTagName("th")[2].childNodes[0].nodeValue = "Daily Total Value"
        document.getElementsByTagName("th")[3].childNodes[0].nodeValue = "Population"
        document.getElementsByTagName("th")[4].childNodes[0].nodeValue = "Metro"
        document.getElementsByTagName("th")[5].childNodes[0].nodeValue = "Currency"
        document.getElementsByTagName("th")[6].childNodes[0].nodeValue = "Airport"
        document.getElementsByTagName("th")[7].childNodes[0].nodeValue = "Timezone"
    }))
}