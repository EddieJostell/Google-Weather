var InfoWindows = [];
var allMyMarkers = [];

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
            //console.log(element.CountryName);
               var marker = createMarkers(
                    parseFloat(element.CapitalLatitude),
                    parseFloat(element.CapitalLongitude), 
                    map,  
                    element.CapitalName, element.CountryName);
                    allMyMarkers.push(marker);
            }
        }
        popDropDownList(allMyMarkers, map);
    })
    .catch(function(error) {
        console.log('Request failed', error); 
    });		
} 
    
function createMarkers(lat, long, map, capital, country) {
    let marker = new Marker({ 
        position: {lat:lat, lng: long},
        id: capital,
        country: country,
        map: map,
        title: capital,
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
    return marker;
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
        get5dayForecastFromAPI(marker.position.lat(), marker.position.lng(), infowindow);  
        closeAllInfoWindows();        
        infowindow.open(map, marker);
    });
}

function getCurrentWeatherFromAPI(lat, long, infowindow) {
    let weather = `sweden.json`; //`sweden.json` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=006595c752436e02740e9d8ff6b6cd05 | eb3bc19f92d9df047f452e1230df445c
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
        <a href="#" class="divBtn" id="button" onclick="showHidePopup();"> <h4 class="para">${info.name}<- more!</h4></a>
        <h4 class="title">Temperature: ${info.main.temp} °C</h4>
        <h4 class="para">Wind: ${info.wind.speed} m/s | ${info.wind.deg} degrees</h4>				
        <h4 class="para">Humidity ${info.main.humidity}%</h4>
        <h4 class="para">${info.weather[0].main} <i class="owf owf-${info.weather[0].id}"></i></h4>
    </div>`;
    
    infowindow.setContent(weatherInfo); 
}

function weatherLiteralForSite(current) {
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(utc);
    var dayName = days[d.getDay()];
   
    weatherDiv.innerHTML = "";
    let weatherInfo = 
    `<div class="wDiv">
        <div class="wLeft">
            <h1 class="">${current.name} </h1>
            <h2>${dayName}</h2>
            <h1 class=""><img class="img" src="../img/thermo-light.png" alt="Temperature:"/>${current.main.temp} °C</h1>
        
        </div>
        
        <div class="wRight">
            <h2 class=""><i class="owf owf-${current.weather[0].id}"></i> ${current.weather[0].main}</h2>
            <h2 class=""><img class="img" src="../img/humidity-light.png" alt="Humidity:"/> ${current.main.humidity}%</h2>
            <h2 class=""><img class="img" src="../img/wind-lines-light.png" alt="Wind:"/> ${current.wind.speed} m/s | ${current.wind.deg} degrees</h2>				   
        </div>
    </div>`;
        weatherDiv.innerHTML += weatherInfo;
        return current;
}

function get5dayForecastFromAPI(lat, long) {
    let forecast = `forecast-sthlm.json`; //`forecast-sthlm.json` `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&APPID=006595c752436e02740e9d8ff6b6cd05` | eb3bc19f92d9df047f452e1230df445c
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
    //console.log("function recieve data?", forecast);
     for (var i = 0; i < forecast.list.length; i+=8) {
        var element = forecast.list[i];

         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
         var d = new Date(element.dt_txt);
         var dayName = days[d.getDay()]; 

        forecastDiv.innerHTML = "";
        let forecastInfo = 
        `<div class="siteDiv">
            <h3 class="">${dayName}: 12:00 </h3>
            <h4 class=""><i class="owf owf-${element.weather[0].id}"></i> ${element.weather[0].description}</h4>
            <h4 class=""><img class="img" src="../img/thermo-light.png" alt="Temperature" /> ${element.main.temp.toFixed(0)} °C</h4>
            <h3 class=""><img class="img" src="../img/humidity-light.png" alt="Humidity:"/> ${element.main.humidity} %</h3>
            <h4 class=""><img class="img" src="../img/wind-lines-light.png" alt="Wind:" /> ${element.wind.speed.toFixed(0)} m/s | ${element.wind.deg.toFixed(0)} degrees</h4> 
        </div>`;
            total = total + forecastInfo;
    } 
    forecastDiv.innerHTML = total; 
}

function popDropDownList(allMarkers, map) {  
    var select = document.getElementById("selectCity");
    for(var i = 0; i < allMarkers.length; i++) {
        var el = document.createElement("option");
        el.textContent = allMarkers[i].title + " " + " - " + allMyMarkers[i].country;
        el.value = allMarkers[i].id;
        select.appendChild(el);   

        var sel = $('#selectCity');
        var selected = sel.val(); // cache selected value, before reordering
        var opts_list = sel.find('option');
        opts_list.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
        sel.html('').append(opts_list);
        sel.val(selected);                      
    }   
        
    document.getElementById("selectCity").onchange=function() {
        var val = this.value;
        var currentMarker = null;
        for(var i = 0; i < allMarkers.length; i++) {
            if(val === allMarkers[i].id) {
                currentMarker = allMarkers[i];
            }
        }
        /* console.log(currentMarker);
        $(".gm-style-iw").find("#button").trigger('click'); */

        new google.maps.event.trigger(currentMarker, 'click');
        map.setCenter({lat: currentMarker.position.lat(), lng: currentMarker.position.lng()});
        map.setZoom(7);
    }
    
}

function showHidePopup() {
   
        $(".site").fadeIn(300, function(){
            $(this).focus();});
     
    $('.backBtn').click(function() {
     $("#capital").fadeOut(300);
    });

    $(document).mouseup(function(e) {
        var container = $(".window");
        var site = $('.site');

        if (!container.is(e.target) && container.has(e.target).length === 0 && !site.is(e.target) && site.has(e.target).length === 0 ) {  // if the target of the click isn't the container nor a descendant of the container
            $('.site').fadeOut(300);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initMap);
