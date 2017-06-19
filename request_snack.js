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
var moment = require('moment');

//Setting PUG view engine
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('img'));


//------ROUTES----------//

app.get('/', function(req,res){
	var now = moment().format("HH:mm");
	var day = moment().format('dddd');

	res.render("home", {
		now: now,
		day: day
	});
})

app.get('/search', function(req,res){
	var day = moment().format('dddd');
	var now = moment().format("ddd, hA");
	
	res.render("search", {
		now: now, 
		day: day
	});
})




app.post('/results', function(req,res){

	var query = req.body.searchquery;
	console.log('Query: '+query);

	//GOOGLE REQUEST URL
	//ALWAYS THE SAME
  	const baseURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    const key = 'key='+process.env.googleapikey;
    const mapsapikey = 'key='+process.env.googlemapskey;

    
    //VARIABLES
    const location = 'location=52.370216,4.895168';
    const radius = 'radius=1000';
    //REQUEST TO GOOGLE API
    const url = `${baseURL}${location}&${radius}&types=restaurant&${key}`;
	console.log(url);


	request({
		uri: url,
		method: "GET",
		timeout: 10000,
		followRedirect: true,
		maxRedireccts: 10
	}, function(err, response, body) {

		var allresults = [];

		if(err){
			console.log(err);
		} else {
			var responseparsed = JSON.parse(body);
			var results = responseparsed.results;

			for (var i = 0; i < results.length; i++) {
				console.log('Results: '+results[i].name);
				console.log('Adress: '+results[i].formatted_address);
				console.log('Rating: '+results[i].rating);
				var openinghours = results[i].opening_hours
				if (openinghours !== undefined){
						console.log('Open now: '+openinghours.open_now);
						allresults.push(results[i]);
				} else {
					console.log('Unfortunately no opening hours provided');
				}
			} 
		} 
		console.log('All results: '+allresults);
		res.render("results", {
			allresults: allresults,
			mapsapikey: mapsapikey
		});
	}); 
});


//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});