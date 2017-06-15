//---------CONFIG AND LIBRARIES-----------------

const request = require('request');

const baseURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const key = 'key=AIzaSyD3iPbO5Vm0TDeRZT8o0XBGiL0oUZ8vBX4';
const location = 'location=52.370216,4.895168';

const radius = 'radius=10';



//API 
const url = `${baseURL}${location}&${radius}&types=food&${key}`;

request({
	uri: url,
	method: "GET",
	timeout: 10000,
	followRedirect: true,
	maxRedireccts: 10
}, function(err, response, body) {
	console.log(body);
});


