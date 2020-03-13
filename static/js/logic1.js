// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {//this is using version 4 of d3 b/c it doesn't have
//the .then
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);//.features
});

  function createFeatures(earthquakeData) {
 // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  };

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {//takes the data as its 1st parameter
    onEachFeature: onEachFeature//and something else (some function to run over)
  });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);


function createMap(earthquakes) {

  // Define satellitemap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0,1,2,3,4,5];
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHtml +=
            '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i>' +
            + magnitudes[i] + (magnitudes[i+1] ? ' - ' + magnitudes[i+1] + '<br>' : '+');
      }
      
      return div;
  };

  ListeningStateChangedEvent.addTo(myMap);

}

//  var coordinates = [earthquakeData[i].geometry.coordinates[i],earthquakeData[i].geometry.coordinates[0]]
//  var magnitude = earthquakeData[i].properties.mag;

//   var circle = L.circle([coordinates], {
//       color: 'red',
//       fillColor: 'white',
//       fillOpacity: '0.5',
//       radius: markersize(magnitude)
//   }).addTo("map")