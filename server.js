'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const geocod = process.env.GEOCODE_API_KEY;

const cors = require('cors');
app.use(cors());


/////// create app get//////
app.get('/location', (request, response) => {
 
  
  
  try {
    const city = request.query.city;
    let url = `https://us1.locationiq.com/v1/search.php?key=${geocod}&q=${city}&format=json`
    superagent.get(url)
      .then(result => {
        const locationSearch = new Location(city, result.body);
        response.send(locationSearch);
      })
  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
});

app.get('/weather', (request, response) => {
  try {
    const darksky = require('./data/darksky.json');
    let data = darksky.daily.data;
    ////// with map//////
    let dailyWeatherAll2 = data.map(value => {
      return new Weather(value);
    });
    // const weathers = request.query.search_query;
    response.send(dailyWeatherAll2);
    response.status(200).json(dailyWeatherAll2)
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
  this.time = new Date(day.time *1000).toDateString()
}

/////////// Error functions///////////
app.use('*', notFoundHandler);
app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('this route does not compute?!?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}



/////// app listener//////////

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
