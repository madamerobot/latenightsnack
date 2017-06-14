//---------CONFIG AND LIBRARIES-----------------

//Requiring express library
const express = require('express');
//Initialising express library
const app = express();

//Requiring file system library
const fs = require('fs');

//Requiring body parser library
//This adds a body property to the request parameter of every app.get and app.post
const bodyParser = require('body-parser');
//Initialising body-parser li;brary
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

//Requiring & Initialisinf Google API
var GooglePlaces = require('google-places');
var places = new GooglePlaces('AIzaSyD3iPbO5Vm0TDeRZT8o0XBGiL0oUZ8vBX4');

//Setting PUG view engine
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

//------ROUTES----------//

app.get('/', function(req,res){
	res.render("home");
})

app.get('/search', function(req,res){
	res.render("search");
})

app.post('/search', function(req,res){

	var query = req.body.searchquery;
	console.log('Query: '+query);

	places.search({keyword: query}, function(err, response){
		console.log('hi');
		console.log("search: ", response.results);
 
		places.details({reference: response.results[0].reference}, function(err, response) {
		console.log("search details: ", response.result.website);
		// search details:  http://www.vermonster.com/ 
  		});
	});
});

// app.post(`/https://maps.googleapis.com/maps/api/place/nearbysearch/json?`+${query}+`AIzaSyD3iPbO5Vm0TDeRZT8o0XBGiL0oUZ8vBX4`);

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});