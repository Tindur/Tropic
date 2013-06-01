$(document).ready(function () {
    var longitude, latitude, map, markers;

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

        // Add custom controls to map
        var customControlDiv = document.createElement('div');
        var customControl = new CustomControl(customControlDiv, map);
        customControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(customControlDiv);

        google.maps.event.addListener(map, "bounds_changed", function() {
            console.log("map bounds: ", map.getBounds());
            var bounds = map.getBounds();
            console.log(bounds.$);
            socket.emit("create stream", { lat1: bounds.fa.b, lng1: bounds.$.b, lat2: bounds.fa.d, lng2: bounds.$.d });
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

    function CustomControl(controlDiv, map) {

        // Set CSS styles for the DIV containing the control
        // Setting padding to 15 px will offset the control
        // from the edge of the map
        controlDiv.style.padding = '15px';

        // Set CSS for the control border
        var controlUI = document.createElement('div');
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3),0 -3px 8px rgba(0,0,0,0.2)';
        controlUI.style.borderRadius = '2px';
        controlUI.style.backgroundColor = 'white';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.style.padding = '8px';
        controlUI.style.color = '#666';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlUI.appendChild(controlText);

        var searchBox = document.createElement('input');
        searchBox.id = "search_address";
        searchBox.placeholder = 'Search';
        searchBox.style.fontSize = '16px';
        controlUI.appendChild(searchBox);

        /*var searchButton = document.createElement('button');

        searchButton.id = "search_address";
        controlUI.appendChild(searchButton); */
        //controlText.innerHTML = '<input type="text" id="search_address" value=""/><button onclick="search();">Search</button>';
        var geocoder = new google.maps.Geocoder();

        var search = function search() {
            geocoder.geocode(
                {
                    'address': searchBox.value},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var loc = results[0].geometry.location;
                        longitude = loc.lng();
                        latitude = loc.lat();
                        map.setCenter(new google.maps.LatLng(latitude, longitude), 12);
                        // use loc.lat(), loc.lng()
                    }
                    else {
                        //alert("Not found: " + status);
                    }
                }
            );
        };

        google.maps.event.addDomListener(controlUI, 'keypress', function(e) {
            if (e.keyCode == 13) {
                search();
                return false;
            }
        });

        // Setup the click event listeners: simply set the map to
        google.maps.event.addDomListener(controlUI, 'click', function() {
            search();
        });

    }

    socket.on('tweet', function (data) {
        console.log(data);
    });
});