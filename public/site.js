$(document).ready(function () {
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
  }
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