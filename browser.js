var request = require('xhr');
var L = require('leaflet');
require('leaflet-draw');
require('leaflet-providers');

L.Icon.Default.imagePath = '/leaflet/images';

var map = L.map('map');
map.setView([33.4294, -111.9431],11); //phoenix metro
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