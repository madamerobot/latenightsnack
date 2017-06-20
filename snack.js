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

//Requiring moment module
var moment = require('moment');

//Setting PUG view engine
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('css'));
app.use(express.static('img'));

//----API KEYS----//
const mapsjsapikey = 'key='+process.env.googlemapsjsapi;
const key = 'key='+process.env.googleapikey;

//------ROUTES----------//

app.get('/', function(req,res){

	var now = moment().format("HH:mm");
	var day = moment().format("dddd");
	res.render("home", {now: now, day: day, mapsjsapikey: mapsjsapikey});
})

app.post('/results', function(req,res){

	//PARAMETERS FOR SEARCH QUERY FOR RESTAURANTS, OPEN NOW
	const baseurl = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?';
	const location = 'location=52.370216,4.895168';
	const radius = 'radius=5000';
	const type = 'type=restaurant';
	const opennow = 'open_now=true';

	// const queryurl = `${baseurl}${location}&${radius}&${type}&${opennow}&${key}`;
	const queryurl = `${baseurl}${location}&${radius}&${type}&${opennow}&${key}`;
	console.log('Query URL: '+queryurl);

	//SEARCH QUERY TO GOOGLE PLACES API, USING REQUEST MODULE
	request({
		uri: queryurl,
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
					console.log('Results length: '+results.length)
					allresults.push(results[i]);
				} 
			} 
			res.render("results", {allresults: allresults, mapsjsapikey: mapsjsapikey});
			console.log('Allresults: '+allresults);
		}
	)
});

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost:' + server.address().port);
});