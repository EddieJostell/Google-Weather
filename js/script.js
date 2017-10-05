
function initMap(){
    
    
    //AIzaSyCt7sLtWFV6-iUi00e1gbz43NnlrGn6jOo
    
    
    let location = {lat: 52.520007, lng: 13.404954};
    var map = new google.maps.Map(document.getElementById('map'), {
        styles: [{
            "featureType": "administrative.locality",
            "elementType": "labels",
            "stylers": [{
                "visibility": "on"
            }]
        }],
        zoom: 4,
        center: location
    });

    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { 
            var myObj = JSON.parse(this.responseText);
            //console.log("Json parsed data is: " + JSON.stringify(myObj)); 
            for (var key in myObj) {
                if (myObj.hasOwnProperty(key)) {
                    var element = myObj[key];
                    //console.log(element.CapitalName);
                    createMarkers(
                    parseFloat(element.CapitalLatitude),
                    parseFloat(element.CapitalLongitude), 
                    map,  
                    element.CapitalName);

                }
            }
        }
    };
    xmlhttp.open("GET", "country-capitals.json", true);
    xmlhttp.send();
    
    
    /* var myLatLng = {lat: 48.856614, lng: 2.352222};
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Paris'
    }); */    
} 

function createMarkers(lat, long, map, capital) {
        let marker = new google.maps.Marker({ 
            position: {lat:lat, lng: long},
            map: map,
        });
        
        createInfoWindow(capital, marker, map, lat, long);        
        //}
    }
    
    function createInfoWindow(capital, marker, map, lat, long, winfo) {
        //console.log("YOLO", winfo);

       /*  let weatherInfo = `<div class="">
        <div class="card-block">
        <h6 class="card-title">Temp:  Degrees Celcius</h6>
        <p class="card-text">Pressure</p>				
        <p class="card-text">Humidity</p>
        <p class="card-text">Clouds in the Sky:  </p>
        <p class="card-text">Name: </p>
        </div>
        </div>`; */
      
    
        let infowindow = new google.maps.InfoWindow({
            content: winfo
        });

        
        marker.addListener('click', function() {
            //console.log("YOLO", lat, long)
           getCurrentWeatherFromAPI(lat, long);
           
            infowindow.open(map, marker);
        });
    }
    
    
    function getCurrentWeatherFromAPI(lat, long) {
        
        //006595c752436e02740e9d8ff6b6cd05
        let weather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=006595c752436e02740e9d8ff6b6cd05`;
        fetch(weather) 
        .then((response) => {
            //console.log(response.json());
            let currentWeather = response.json();
            //console.log(currentWeather);
                return currentWeather;    
        })
        .then(function(currentWeather) {
            //console.log(currentWeather);
            createWeatherLiteral(currentWeather);
            //console.log(currentWeather.main.temp);
        })
        .catch(function(error) {
            console.log('Request failed', error); 
        });		
    }
   
      function createWeatherLiteral(info) {
        let weatherInfo = `<div class="">
        <div class="card-block">
        <h6 class="card-title">Temp: ${info.main.temp} Degrees Celcius</h6>
        <p class="card-text">Pressure ${info.main.pressure}}</p>				
        <p class="card-text">Humidity ${info.main.humidity}</p>
        <p class="card-text">Clouds in the Sky: ${info.clouds.all} </p>
        <p class="card-text">Name: ${info.name} </p>
        </div>
        </div>`;
        //console.log(weatherInfo);
        createInfoWindow(weatherInfo);
        BOOM(weatherInfo);
    } 

    function BOOM(w) {
        console.log(w);
    }

    /* function get5dayForecastFromAPI() {

    } */


    
    //http://www.lab.lmnixon.org/4th/worldcapitals.html