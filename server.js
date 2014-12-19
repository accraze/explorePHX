//imports
var level = require('level');
var express = require('express');
var bodyParser = require('body-parser');

var app = exports.app = express();
var db = level('./db');

app.use(express.static(__dirname + '/public'));
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'));
app.use('/leaflet-draw', express.static(__dirname + '/node_modules/leaflet-draw/dist'));
app.use(bodyParser.json());

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index.ejs');
});

app.get('/geoms', function (req, res) {
	var stream = db.createReadStream();
	var geoms = [];

	stream.on('data', function (data) {
		geoms.push(JSON.parse(data.value));
	});

	stream.on('close', function() {
		res.json(geoms);
	});
});

app.post('/geoms', function (req, res) {
	db.put(newKey(), JSON.stringify(req.body), function () {
		console.log('new geo added');
	});
});

app.post('/geoms', function (req, res) {
	db.put(newKey(), JSON.stringify(req.body), function () {
		console.log('new geo added');
	});
});

module.exports = app;

app.listen(3000, function() {
	console.log('app is listening on port 3000');
});

function newKey() {
	return Math.random().toString().substr(2,8);
}