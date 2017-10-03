

const googleModule = (() => {

    return {
            initMap: () => {
                console.log("HELLO");
                //AIzaSyCt7sLtWFV6-iUi00e1gbz43NnlrGn6jOo


               /*  let location = {lat: 41.385064, lng: 2.173403 };
                let map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 4,
                    center: location
                }); */
            },

      

        //Self-invoking function that will load the DOM content, first page, loading indicator, show if there are any saved articles in the DB and activate all the EventListeners.
		initialize: (() => {
			document.addEventListener('DOMContentLoaded', () => {
                    googleModule.initMap();
			});
		})()
    }
})();