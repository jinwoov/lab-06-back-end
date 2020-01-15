'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const geocod = process.env.GEOCODE_API_KEY;
let location =[];
const cors = require('cors');
app.use(cors());


/////// create app get//////
app.get('/location', (request, response) => {
 
  
  
  try {
    const city = request.query.city;
    let urlLocation = `https://us1.locationiq.com/v1/search.php?key=${geocod}&q=${city}&format=json`
    location.search_query === city ? response.send(location)
      :superagent.get(urlLocation)
        .then(result => {
          const locationSearch = new Location(city, result.body);
          location = locationSearch;
          response.send(location);
        })
  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherAPI = process.env.WEATHER_API_KEY;
    let urlLocation = `https://api.darksky.net/forecast/${weatherAPI}/${location.latitude},${location.longitude}`;
    // console.log(urlLocation)
    superagent.get(urlLocation)
      .then(result => {
        let data = result.body.daily.data;
        ////// with map//////
        let dailyWeatherAll2 = data.map(value => {
          return new Weather(value);
        });
        response.send(dailyWeatherAll2);
        response.status(200).json(dailyWeatherAll2)
      })
  }
  catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
});


app.get('/events', (request, response) => {
  try {
    const eventAPI = process.env.EVENTFUL_API_KEY;
    let urlEvent = `http://api.eventful.com/json/events/search?keywords=music&location=${location.search_query}&app_key=${eventAPI}`;
    superagent.get(urlEvent)
      .then(result => {
        let parsedData = JSON.parse(result.text);
        let eventList = parsedData.events.event
        let eventListing = eventList.map(value => {
          return new Event(value);
        });
        response.send(eventListing);
        response.status(200).json(eventListing)
      })
  } catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }

})

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

function Event(obj){
  this.link = obj.url;
  this.name = obj.title;
  this.event_date = obj.start_time.slice(0,11)
  this.summary = obj.description
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
