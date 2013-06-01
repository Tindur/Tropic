$(document).ready(function () {
    var longitude, latitude, map, markers, perflogen = true;

    var socket = io.connect('/');

    var infowindow = new google.maps.InfoWindow({});

    function initialize() {
        console.log("shit");
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(51.5001524, -0.1262362),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        google.maps.event.addListener(map, "bounds_changed", function() {
            console.log("map bounds: ", map.getBounds());
            var bounds = map.getBounds();
            console.log(bounds.$);
            if(perflogen === true) {
                perflogen = false;
                socket.emit("create stream", { lat1: bounds.fa.b, lng1: bounds.$.b, lat2: bounds.fa.d, lng2: bounds.$.d });
                setTimeout(function () { perflogen = true;}, 1000);
            }
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
    
    $("#myGeo").click(function () {
        if (navigator.geolocation) {
            console.log("penises");
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else {
            $("#text").html("Geolocation is not supported by this browser.");
        }
    });

    function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        // console.log("showing position", position.coords.latitude, position.coords.longitude);
        $("#text").html("Latitude: " + latitude + "<br>Longitude: " + longitude); 
        map.setCenter(new google.maps.LatLng(latitude, longitude), 12);
        markers = [[latitude, longitude, "current"],[latitude+0.05,longitude+0.05,"+0.05"],[latitude-0.05,longitude-0.05,"-0.05"]];
        addMarker();
    }

    function addMarker() {
        for (var i = 0; i < markers.length; i++) {
            var lat = parseFloat(markers[i][0]);
            var lng = parseFloat(markers[i][1]);
            var trailhead_name = markers[i][2];

            var myLatLng = new google.maps.LatLng(lat, lng);

            var contentString = "<html><body><div><h2>" + trailhead_name + "</h2></div></body></html>";

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: "This is your penis baby: " + lat + ", " + lng,
                infowindow: contentString
            });

            // marker['infowindow'] = contentString;

            // globalMarkers[i] = marker;

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(this['infowindow']);
                infowindow.open(map, this);
            });
        }
    }

    function addTweetMarker(data) {
        if(data.hasOwnProperty('coordinates') && data.coordinates !== null) {
            console.log(data.coordinates.coordinates);
            var lat = data.coordinates.coordinates[1];
            var lng = data.coordinates.coordinates[0];
            var text = data.text;

            var myLatLng = new google.maps.LatLng(lat, lng);

            var contentString = "<blockquote class=\"twitter-tweet\"><p>" + text + "</p>&mdash;" + data.user.name + " (@" + data.user.screen_name + ") <a href=\"https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str + "\">" + data.created_at + "</a></blockquote> <script async src=\"http://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>";

            // var contentString = "<html><body><div><h2>" + text + "</h2></div></body></html>";

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: "This is your penis baby: " + lat + ", " + lng,
                infowindow: contentString
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(this['infowindow']);
                infowindow.open(map, this);
            });
            twttr.widgets.load();

        }
    }
    socket.on('tweet', function (data) {
        console.log(data);
        addTweetMarker(data);
    });
});