
/*
 const googleModule = (() => {

    let map;

    return {

        
            initMap: () =>{
                console.log("HELLO");
                //AIzaSyCt7sLtWFV6-iUi00e1gbz43NnlrGn6jOo


                let location = {lat: 48.856614, lng: 2.352222};
                   let map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 4,
                    center: location
                });
            },

             onReadyCallback: () => {
                console.log("function working?");
                if (document.querySelector('#map').length > 0) {
                    if (document.querySelector('html').lang) 
                        lang = document,querySelector('html').lang;
                    
                    else 
                        lang = 'en';

                        var js_file = document.createElement('script');
                        js_file.type = 'text/javascript';
                        js_file.src = 
                        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCt7sLtWFV6-iUi00e1gbz43NnlrGn6jOo&callback=googleModule.initMap&language=' + lang;
                        document.getElementsByTagName('head')[0].appendChil(js_file); 
                }
            }, 

      
        //Self-invoking function that will load the DOM content, first page, loading indicator, show if there are any saved articles in the DB and activate all the EventListeners.
		initialize: (() => {
			document.addEventListener('DOMContentLoaded', function() {
                    googleModule.onReadyCallback();
			});
		})()
    }
})(); */


/* document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelectorAll('#map').length > 0)
    {
      if (document.querySelector('html').lang)
        lang = document.querySelector('html').lang;
      else
        lang = 'en';
  
      var js_file = document.createElement('script');
      js_file.type = 'text/javascript';
      js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCt7sLtWFV6-iUi00e1gbz43NnlrGn6jOo&callback=initMap&language=' + lang;
      document.getElementsByTagName('head')[0].appendChild(js_file);
    }
  }); */

  

 function initMap(){

    var country = [];
    var zone = [];

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
    
      //createMarkers(map);

      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) { 
          var myObj = JSON.parse(this.responseText);
          //console.log("Json parsed data is: " + JSON.stringify(myObj));
          for (var i = 0; i < myObj.length; i++) {
              var element = myObj[i];
             //console.log(myObj[i].latlng);
              createMarkers(myObj[i].latlng[0],myObj[i].latlng[1], map);
          }     
         }
      };
    xmlhttp.open("GET", "countries.json", true);
    xmlhttp.send();


    //createMarkers(, map);
    //console.log(zone);
    /* var myLatLng = {lat: 48.856614, lng: 2.352222};
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Paris'
      }); */

 /*      var mark = [ [48.856614, 2.352222]]
      
         
          for (var i = 0; i <mark.length; i++) {
              console.log("HEJ ", mark[i][0], mark[i][1]);
              new google.maps.Marker({
                 // position: {lat:mark[i][0], lng:mark[i][1]},
                 position: {lat:48.856614, lng:2.352222},
                  map: map
              
              });
              
          } */
   
} 
var markers = [];
function createMarkers(lat, long, map) {
   

   
    /* for (var i = 0; i <markerz.length; i++) { */

        console.log("HEJ ", lat, long);
        new google.maps.Marker({
           // position: {lat:mark[i][0], lng:mark[i][1]},
           position: {lat:lat, lng: long},
            map: map,
            
        });
        
    //}
}

//http://www.lab.lmnixon.org/4th/worldcapitals.html