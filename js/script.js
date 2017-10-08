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
        console.log(marker.position.lat(), marker.position.lng());
        getCurrentWeatherFromAPI(marker.position.lat(), marker.position.lng(), infowindow);   
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
    })
    .catch(function(error) {
        console.log('Request failed', error); 
    });		
}

function createWeatherLiteral(info, infowindow) {
    let weatherInfo = 
    `<div class="window">
       <a href="#link1"> <h5 class="para">City: ${info.name} </h5> </a>
        <h5 class="title">Temperature: ${info.main.temp} °C</h5>
        <h5 class="para">Wind: ${info.wind.speed} m/s / ${info.wind.deg} degrees</h5>
        <h5 class="para">Lowest temperature: ${info.main.temp_min} °C</h5>
        <h5 class="para">Highest temperature: ${info.main.temp_max} °C</h5>					
        <h5 class="para">Humidity ${info.main.humidity}%</h5>
        <h5 class="para"><i class="owf owf-${info.weather[0].id}"></i>${info.weather[0].description} in the sky </h5>
    </div>`;

    infowindow.setContent(weatherInfo); 
} 

google.maps.event.addDomListener(window, 'load', initMap);