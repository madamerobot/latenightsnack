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

//Requiring 'request' module
var request = require('request');

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

	//GOOGLE REQUEST URL
	//ALWAYS THE SAME
	const baseURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
	const key = 'key=AIzaSyD3iPbO5Vm0TDeRZT8o0XBGiL0oUZ8vBX4';
	
	//VARIABLES
	const location = 'location=52.370216,4.895168';
	const radius = 'radius=10';

	//REQUEST TO GOOGLE API
	const url = `${baseURL}${location}&${radius}&types=food&${key}`;

	request({
		uri: url,
		method: "GET",
		timeout: 10000,
		followRedirect: true,
		maxRedireccts: 10
	}, function(err, response, body) {
		// console.log('Body: '+body);
		console.log('Response: '+response)
		console.log('Results: '+response.results); //RETURNS UNDEFINED
		console.log(body.html_attributions); //RETURNS UNDEFINED
	});
});

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});