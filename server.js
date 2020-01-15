'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;

const cors = require('cors')
app.use(cors());


/////// create app get//////
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
    errorHandler('So sorry, something is acting up.', request, response);
  }
});

//////////Constructors////////
function Location(apple, banana) {
  this.search_query = apple;
  this.formatted_query = banana[0].display_name;
  this.latitude = banana[0].lat;
  this.longitude = banana[0].lon;
}

function Weather(day) { 
  this.forecast = day.summary;
  this.time = new Date(day.time *1000).toString().slice(0, 15);
}

/////////// Error functions///////////
app.use('*', notFoundHandler);
app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('this route is does not compute?!?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}



/////// app listener//////////

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
