
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
        zoom: 5,
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
    
   // var myLatLng = {lat: 48.856614, lng: 2.352222};
   // var marker = new google.maps.Marker({
     //   position: myLatLng,
      //  map: map,
      //  title: 'Paris'
    //});    

} 

  function createMarkers(lat, long, map, capital) {
        let marker = new google.maps.Marker({ 
            position: {lat:lat, lng: long},
            map: map,
        });
        createInfoWindow(capital, marker, map, lat, long);  
    }
    
    var InfoWindows = [];

    function createInfoWindow(capital, marker, map, lat, long, weatherInfo) {
        let infowindow = new google.maps.InfoWindow({
            //content: capital
        });
        InfoWindows.push(infowindow);
        
        function closeAllInfoWindows() {
            for (var i = 0; i < InfoWindows.length; i++) {
                    InfoWindows[i].close();
                
            }
        }

        marker.addListener('click', function() {
            console.log("On Marker click invoke weather function");
            //console.log("YOLO", lat, long)
            getCurrentWeatherFromAPI(lat, long, infowindow);   
            closeAllInfoWindows();        
            infowindow.open(map, marker);
        });
    }
    
    
    function getCurrentWeatherFromAPI(lat, long, infowindow) {
        console.log("getCurrentWeatherFromAPI, start as you click a marker");
        //006595c752436e02740e9d8ff6b6cd05 API KEY FOR Eduardo
        //eb3bc19f92d9df047f452e1230df445c API KEY FOR wardo1987
        //let weather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=006595c752436e02740e9d8ff6b6cd05`;
        //let weather2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=eb3bc19f92d9df047f452e1230df445c`;
        let weather3 = "sweden.json";
           fetch(weather3) 
        .then((response) => {
            //console.log(response.json());
            let currentWeather = response.json();
            console.log(currentWeather);
                return currentWeather;    
        })
        .then(function(currentWeather) {
            createWeatherLiteral(currentWeather, infowindow);
        })
        .catch(function(error) {
            console.log('Request failed', error); 
        });		
    }
   
      function createWeatherLiteral(info, infowindow) {
          console.log("createWeatherLiteral start as getCurrentWeatherFromAPI start?");
        let weatherInfo = `<div class="window">
        <h5 class="para">City: ${info.name} </h5>
        <h5 class="title">Temperature: ${info.main.temp} °C</h5>
        <h5 class="para">Wind: ${info.wind.speed} m/s / ${info.wind.deg} degrees</h5>
        <h5 class="para">Lowest temperature: ${info.main.temp_min} °C</h5>
        <h5 class="para">Highest temperature: ${info.main.temp_max} °C</h5>					
        <h5 class="para">Humidity ${info.main.humidity}%</h5>
        <h5 class="para">${info.weather[0].description} in the sky</h5>
        </div>`;
        infowindow.setContent(weatherInfo);
        console.log(weatherInfo);
        
       
    }  
 

   
    
   

 


    
    //http://www.lab.lmnixon.org/4th/worldcapitals.html