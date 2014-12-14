var level = require('level');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
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

app.listen(3000, function() {
	console.log('app is listening on port 3000');
});