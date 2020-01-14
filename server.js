'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors')
app.use(cors());

///// use the env port to our server
///// utilize express//////

//// create app get with path way of /location//////
app.get('/location', (request, response) => {
  try {
    const geoFile = require('./data/geo.json')
    const city = request.query.city;
    const locationSearch = new Location(city, geoFile)
    response.send(locationSearch)
  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
})

app.get('/weather', (request, response) => {
  try {
    const dailyWeatherAll = [];
    const darksky = require('./data/darksky.json');
    let data = darksky.daily.data;
    data.forEach(value => {
      dailyWeatherAll.push(new Weather(value))
    });
    // const weathers = request.query.search_query;
    response.send(dailyWeatherAll)

  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', response);
  }
});



///////create error handler


////create a constructor
function Location(apple, banana) {
  this.search_query = apple;
  this.formatted_query = banana[0].display_name;
  this.latitude = banana[0].lat;
  this.longitude = banana[0].lon;
}

function Weather(day) { 
  this.forecast = day.summary;
  this.time = new Date(day.time).toString().slice(0, 15);
}




function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}



/////// create app listenr

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
