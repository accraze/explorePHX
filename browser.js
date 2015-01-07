var request = require('xhr');
var L = require('leaflet');
require('leaflet-draw');
require('leaflet-providers');

L.Icon.Default.imagePath = '/leaflet/images';

var map = L.map('map');
map.setView([33.4294, -111.9431],9); //phoenix metro area
var layer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/spatial.b625e395/{z}/{x}/{y}.png', {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});
layer.addTo(map);

var drawnItems, drawControl;

request('/geoms', function (err, res) {
	var existingGeoms = JSON.parse(res.body);
	drawnItems = L.geoJson(existingGeoms);
	//map.addLayer(drawnItems);

    var runs = L.geoJson(existingGeoms, {
        filter: function(feature, layer) {
            return feature.properties.BusType == "Run";
        },
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                //icon: cafeIcon
            }).on('mouseover', function() {
                this.bindPopup(feature.properties.Name + feature.properties).openPopup();
            });
        }
    });


    var hikes = L.geoJson(existingGeoms, {
        filter: function(feature, layer) {
            return feature.properties.ActType != "Run";
        },
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {

            }).on('mouseover', function() {
                this.bindPopup(feature.properties.Name).openPopup();
            });
        }
    });

    // map.fitBounds(drawnItems.getBounds(), {
    //     padding: [50, 50]
    // });


    runs.addTo(map)
    hikes.addTo(map)

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
