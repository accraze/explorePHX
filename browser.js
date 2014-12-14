var request = require('xhr');
var L = require('leaflet');
require('leaflet-draw');
require('leaflet-providers');

L.Icon.Default.imagePath = '/leaflet/images';

var map = L.map('map');
map.setView([47.63,-122.32],11); //seattle...change!!
var layer = L.tileLayer.provider('Stamen.Watercolor');
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