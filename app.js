const corona1=new Corona;
/*
//pieChart Golbal Cases 
document.querySelector('.b1-global').addEventListener('click',disp);
function disp(){
    corona1.get('https://api.covid19api.com/summary') //promies is returned from the get method
    .then((dataC)=>{
     
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    
        function drawChart() {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            data.addRows([
              ['New Confirmed', dataC.Global.NewConfirmed],
              ['Total Confirmed', dataC.Global.TotalConfirmed],
              ['New Deaths', dataC.Global.NewDeaths],
              ['Total Deaths', dataC.Global.TotalDeaths],
              ['New Recovered', dataC.Global.NewRecovered],
              ['Total Recovered',dataC.Global.TotalRecovered]
            ]);
    
            // Set chart options
            var options = {'title':'LIVE GLOBAL CORANA CASES',
                           'width':1000,
                           'height':800};
    
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart.draw(data, options);
          }
    })
    .catch(err=>console.log(err))
}
*/

//maps
                      
anychart.onDocumentReady(function () {

  anychart.data.loadJsonFile("data.json", function (data) {

    // Variables
    // go into the records section of the data
    var geoData = data.records

    // sum of all cases per country
    var sumCases = 0;

    // sum of all deaths per country
    var sumDeaths = 0;

    // convert cases and deaths to numbers
    var numC;
    var numD;

    // create a new array with the resulting data
    var data = [];

    // Go through the initial data
    for (var i = 0; i < geoData.length; i++) {
      // convert strings to numbers and save them to new variables
      numC = parseInt(geoData[i].cases);
      numD = parseInt(geoData[i].deaths);

      // check if we are in the same country by comparing the geoId. 
      // if the country is the same add the cases and deaths to the appropriate variables
      if ((geoData[i + 1]) != null && (geoData[i].geoId == geoData[i + 1].geoId)) {
        sumCases = sumCases + numC;
        sumDeaths = sumDeaths + numD;
      }
      else {
        // add last day cases and deaths of the same country
        sumCases = sumCases + numC;
        sumDeaths = sumDeaths + numD;

        // insert the resulting data in the array using the AnyChart keywords 
        data.push({ id: geoData[i].geoId, value: sumCases, size: sumDeaths, title: geoData[i].countriesAndTerritories })

        // reset the variables to start over
        sumCases = 0;
        sumDeaths = 0;

      }
    };

    // connect the data with the map
    var chart = anychart.map(data);
    chart.geoData(anychart.maps.world);

    // specify the chart type and set the series 
    var series = chart.choropleth(data);

    // variable to store data that will be used for bubbles
    var bubbleData = [];

    // store only the countries that have at least 1 death
    for (var i = 0; i < data.length; i++) {
      if (data[i].size > 0) {
        bubbleData.push(data[i]);
      }
    };

    // create a series for bubbles
    var series_1 = chart.bubble(bubbleData);

    // set the maximum size of the bubble
    chart.maxBubbleSize(25);

    // set the minimum size of the bubble
    chart.minBubbleSize(3);

    // set colors and stroke of bubbles
    series_1.normal().fill("black", 0.3);
    series_1.hovered().fill("black", 0.1);
    series_1.selected().fill("black", 0.5);
    series_1.normal().stroke("rgb(150,33,31)");
    series_1.hovered().stroke("rgb(150,33,31)", 2);
    series_1.selected().stroke("rgb(150,33,31)", 4);

    // set the chart title
    chart.title(" Choropleth Map FOR COVID-19 Global Cases(Up to JUNE )");
    // color scale ranges
    ocs = anychart.scales.ordinalColor([
      { less: 999 },
      { from: 1009, to: 9999 },
      { from: 1000, to: 99999 },
      { from: 100000, to: 299999 },
      { from: 300000, to: 390000 },
      { from: 400000, to: 590000},
      { from: 600000, to: 999999 },
      { greater: 1000000 }
    ]);

    // set scale colors
    ocs.colors(["rgb(252,245,245)", "rgb(241,219,216)", "rgb(229,190,185)", "rgb(211,152,145)", "rgb(192,117,109)", "rgb(178,93,86)", "rgb(152,50,48)", "rgb(150,33,31)"]);

    // tell the series what to use as a colorRange (colorScale)
    series.colorScale(ocs);

    // enable the legend
    chart.legend(true);

    // set the source mode of the legend and add styles
    chart.legend()
      .itemsSourceMode("categories")
      .position('right')
      .align('top')
      .itemsLayout('vertical')
      .padding(50, 0, 0, 20)
      .paginator(false);

    // tooltip formatting
    series.tooltip().format("Total Confirmed Cases: {%value}");
    series_1.tooltip().format("Total Deaths: {%size}");

    // set the container id
    chart.container('container');

    // draw the chart
    chart.draw();
  });


});
