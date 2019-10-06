// Creating tile layer that will be the background of our map.
console.log("working");

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 12,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoidnVudHVyaSIsImEiOiJjazFkOG5pNjEwNWxoM2JwNjBzYm1tcGYyIn0.o0hSQRpfBLYuMpuv149JRg"
});

// Creating map object with options.
var map = L.map("map", {
    center: [
        34.0, 118.2 //los angeles
    ],
    zoom: 4
    
});

// Then we add our 'graymap' tile layer to the map.
graymap.addTo(map);

// Here we make an AJAX call that retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {

    // Function returning the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Function that determines the color of the marker based on the magnitude of the earthquake.
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea2cbe";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#5f00ee";
            case magnitude > 1:
                return "#00eece";
            default:
                return "#e2ee00";
        }
    }

    // Function that determines the radius of the earthquake marker based on the magnitude.
    // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 2;
    }

    // Adding GeoJSON layer to the map once the file is loaded.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Setting style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);

    // Creating a legend control object.
    var legend = L.control({
        position: "bottomright"
    });

    // Adding all the details for legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#e2ee00",
            "#00eece",
            "#5f00ee",
            "#ee9c00",
            "#ea2cbe",
            "#ea2c2c"
        ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // In the last adding legend to the map.
    legend.addTo(map);
});
