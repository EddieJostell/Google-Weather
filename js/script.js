var InfoWindows = [];

function initMap(){
    let location = {lat: 52.520007, lng: 13.404954};		
    var map = new google.maps.Map(document.getElementById('map'), {
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            }
        ],
        zoom: 5,
        center: location
    });

    fetch("country-capitals.json") 
    .then((response) => {
        return response.json();
    })
    .then(function(response) {
        for (var key in response) {
            if (response.hasOwnProperty(key)) {
                var element = response[key];
                createMarkers(
                    parseFloat(element.CapitalLatitude),
                    parseFloat(element.CapitalLongitude), 
                    map,  
                    element.CapitalName);
            }
        }
    })
    .catch(function(error) {
        console.log('Request failed', error); 
    });		
} 
    
function createMarkers(lat, long, map, capital) {
    let marker = new Marker({ 
        position: {lat:lat, lng: long},
        map: map,
        icon: {
            path: SQUARE_PIN,
            fillColor: '#f2f2f2',
            fillOpacity: 0,
            strokeColor: '',
            strokeWeight: 0
        },
        map_icon_label: '<span class="map-icon map-icon-postal-code"></span>'
    });
 
    createInfoWindow(capital, marker, map);  
}

function createInfoWindow(capital, marker, map, weatherInfo) {
    let infowindow = new google.maps.InfoWindow();
    InfoWindows.push(infowindow);

    function closeAllInfoWindows() {
        for (var i = 0; i < InfoWindows.length; i++) {
            InfoWindows[i].close();     
        }
    }
    
    marker.addListener('click', function() {
        getCurrentWeatherFromAPI(marker.position.lat(), marker.position.lng(), infowindow);
        get5dayForecastFromAPI(marker.position.lat(), marker.position.lng());   
        closeAllInfoWindows();        
        infowindow.open(map, marker);
    });
}

function getCurrentWeatherFromAPI(lat, long, infowindow) {
    let weather = `sweden.json`; //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=006595c752436e02740e9d8ff6b6cd05 | eb3bc19f92d9df047f452e1230df445c
    fetch(weather) 
    .then((response) => {
        return response.json();
    })
    .then(function(currentWeather) {
        createWeatherLiteral(currentWeather, infowindow);
        weatherLiteralForSite(currentWeather);
    })
    .catch(function(error) {
        console.log('Request failed', error); 
    });		
}

function createWeatherLiteral(info, infowindow) {
    let weatherInfo = 
    `<div class="window">
       <a href="#" class="divBtn" id="button" onclick="showFrontLayer();"> <h4 class="para">${info.name} </h4> </a>
        <h4 class="title">Temperature: ${info.main.temp} °C</h4>
        <h4 class="para">Wind: ${info.wind.speed} m/s / ${info.wind.deg} degrees</h4>				
        <h4 class="para">Humidity ${info.main.humidity}%</h4>
        <h4 class="para">${info.weather[0].main} <i class="owf owf-${info.weather[0].id}"></i></h4>
    </div>`;
    
    infowindow.setContent(weatherInfo); 
}

function weatherLiteralForSite(current) {
    weatherDiv.innerHTML = "";
    let weatherInfo = 
    `<div class="">
        <h3 class="">${current.name} </h3>
        <h4 class=""><img class="img" src="../img/thermo.png" alt="Temperature:"/>${current.main.temp} °C</h4>
        <h4 class=""><img class="img" src="../img/wind-lines.png" alt="Wind:"/> ${current.wind.speed} m/s / ${current.wind.deg} degrees</h4>				
        <h4 class=""><img class="img" src="../img/humidity.png" alt="Humidity:"/> ${current.main.humidity}%</h4>
        <h4 class="">Weather:<i class="owf owf-${current.weather[0].id}"></i> ${current.weather[0].main}</h4>
    </div>`;
        weatherDiv.innerHTML += weatherInfo;
}

function get5dayForecastFromAPI(lat, long) {
    let forecast = `forecast-sthlm.json`; //`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&APPID=006595c752436e02740e9d8ff6b6cd05` | eb3bc19f92d9df047f452e1230df445c
    fetch(forecast) 
    .then((response) => {
        return response.json();
    })
    .then(function(forecast) {
        forecastLiteral(forecast);
    })
    .catch(function(error) {
        console.log('Request failed', error); 
    });		
}

function forecastLiteral(forecast) {
    
    var total = '';
    console.log("function recieve data?", forecast);
     for (var i = 0; i < forecast.list.length; i+=8) {
        var element = forecast.list[i];
   
        var days = {'Mon': 'Monday','Tue': 'Tuesday','Wed': 'Wednsday','Thu': 'Thursday','Fri': 'Friday'};
         var date = new Date().toString().split(' ')[0]; //get day abreviation first
         console.log(days[date]);

        forecastDiv.innerHTML = "";
        let forecastInfo = 
        `<div class="siteDiv">
            <p class="">Forecast for: ${element.dt_txt}</p>
            <h4 class="">${element.weather[0].main}<i class="owf owf-${element.weather[0].id}"></i></h4>
            <p class=""><img class="img" src="../img/thermo.png" alt="Temperature" /> ${element.main.temp.toFixed(0)} °C</p>
            <p class=""><img class="img" src="../img/humidity.png" alt="Humidity:"/> ${element.main.humidity} %</p>
            <p class=""><img class="img" src="../img/wind-lines.png" alt="Wind:" /> ${element.wind.speed.toFixed(0)} m/s with ${element.wind.deg.toFixed(0)} degrees</p> 
        </div>`;
            total = total + forecastInfo;
    } 
    forecastDiv.innerHTML = total; 

}

function showFrontLayer() {
    document.getElementById('capital').style.visibility='visible';
  }

function hideFrontLayer() {
    document.getElementById('capital').style.visibility='hidden';
  }



google.maps.event.addDomListener(window, 'load', initMap);