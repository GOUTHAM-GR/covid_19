const corona1=new Corona;

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
            var options = {'title':'GLOBAL CORANA CASES',
                           'width':800,
                           'height':700};
    
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart.draw(data, options);
          }
    })
    .catch(err=>console.log(err))
}

function update(){
  corona1.get('https://www.trackcorona.live/api/countries')
  .then((linkD)=>{
    console.log(linkD.data)
    linkD.data.forEach(locations=>{
       let cases=locations.confirmed;
       if(cases>100000){
         color1='rgb(255,0,0)'
       }
       else{
         if(cases>10000 && cases<100000){r=cases*0.001}
         else if(cases>1000 && cases<10000){r=cases*0.01}
         else if(cases>100 && cases<1000){r=cases*0.1}
         
         color1=`rgb(${r},9,0)`;
       }
       console.log(r)

    new mapboxgl.Marker({
      color:color1
    }) .setLngLat([locations.longitude,locations.latitude ])
        .addTo(map);
    })
  })

  

  
}
update();

