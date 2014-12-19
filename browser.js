var request = require('xhr');
var L = require('leaflet');
require('leaflet-draw');
require('leaflet-providers');

L.Icon.Default.imagePath = '/leaflet/images';

var map = L.map('map');
map.setView([33.4294, -111.9431],11); //phoenix metro area
var layer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/spatial.b625e395/{z}/{x}/{y}.png');
layer.addTo(map);

var drawnItems, drawControl;

request('/geoms', function (err, res) {
	var existingGeoms = JSON.parse(res.body);
	drawnItems = L.geoJson(existingGeoms);
	map.addLayer(drawnItems);

	drawControl = new L.Control.Draw({
		edit: {featureGroup: drawnItems}
	});

	map.addControl(drawControl);
});

map.on('draw:created', function (e) {
	drawnItems.addLayer(e.layer);
	request({
		url: '/geoms',
		method: 'post',
		json: e.layer.toGeoJSON()
	});
});


// var promise = $.getJSON("/data/hikes.json");
//     promise.then(function(data) {


//         var allactivities = L.geoJson(data);


//         var runs = L.geoJson(data, {
//             filter: function(feature, layer) {
//                 return feature.properties.BusType == "Run";
//             },
//             pointToLayer: function(feature, latlng) {
//                 return L.marker(latlng, {
//                     icon: runIcon
//                 }).on('mouseover', function() {
//                     this.bindPopup(feature.properties.Name).openPopup();
//                 });
//             }
//         });


//         var others = L.geoJson(data, {
//             filter: function(feature, layer) {
//                 return feature.properties.BusType != "Run";
//             },
//             pointToLayer: function(feature, latlng) {
//                 return L.marker(latlng, {

//                 }).on('mouseover', function() {
//                     this.bindPopup(feature.properties.Name).openPopup();
//                 });
//             }
//         });

//         map.fitBounds(allactivities.getBounds(), {
//             padding: [50, 50]
//         });


//         runs.addTo(map)
//         others.addTo(map)

//   });