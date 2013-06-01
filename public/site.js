$(document).ready(function () {
    var longitude, latitude, map;
    if (navigator.geolocation) {
        console.log("penises");
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        $("#text").html("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
        console.log("showing position", position.coords.latitude, position.coords.longitude);
        $("#text").html("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude); 
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    }

    function initialize() {
        console.log("shit");
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(64.1240947, -21.9262575),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

    google.maps.event.addDomListener(window, 'load', initialize);
});



// var x=document.getElementById("demo");
// function getLocation()
//   {
//   if (navigator.geolocation)
//     {
//     navigator.geolocation.getCurrentPosition(showPosition);
//     }
//   else{x.innerHTML="Geolocation is not supported by this browser.";}
//   }
// function showPosition(position)
//   {
//   x.innerHTML="Latitude: " + position.coords.latitude + 
//   "<br>Longitude: " + position.coords.longitude;	
//   }