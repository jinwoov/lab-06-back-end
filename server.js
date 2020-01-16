'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL)
client.on('error', err => console.error(err))
let location ={};
const cors = require('cors');
app.use(cors());

////////////// create app get///////////

const locationHandler = (request, response) => {
  try {
    const geocod = process.env.GEOCODE_API_KEY;
    const city = request.query.city;
    var selectsql = `Select search_query FROM locationSearch;`;
    let clause = client.query(selectsql);
    console.log(clause)
    if (city === clause) {
      console.log('proof')
    }
    let urlLocation = `https://us1.locationiq.com/v1/search.php?key=${geocod}&q=${city}&format=json`
    location.search_query === city ? response.send(location)
      :superagent.get(urlLocation)
        .then(result => {
          const locationSearch = new Location(city, result.body);
          location = locationSearch;
          // var dropsql = 'DROP TABLE IF EXISTS locationSearch;';
          // client.query(dropsql)
          let sql = `INSERT INTO locationSearch (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *;`;
          let values = [city, location.formatted_query, location.latitude, location.longitude]
          client.query(sql, values)
            .then(results => {
              // console.log(results.rows)
              response.status(200).json(location);
              // response.send(location);
            })
            .catch(error => console.error(error))
        })
  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
};
app.get('/location', locationHandler)

app.get('/weather', (request, response) => {
  try {
    const weatherAPI = process.env.WEATHER_API_KEY;
    let {latitude, longitude} = request.query;
    let urlLocation = `https://api.darksky.net/forecast/${weatherAPI}/${latitude},${longitude}`;
   
    superagent.get(urlLocation)
      .then(result => {
        let data = result.body.daily.data;
        ////// with map//////
        let dailyWeatherAll2 = data.map(value => {
          return new Weather(value);
        });
        response.status(200).send(dailyWeatherAll2)
      })
      .catch(error => console.error(error))
  }
  catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
});

app.get('/events', (request, response) => {
  try {
    const eventAPI = process.env.EVENTFUL_API_KEY;
    // console.log('search_query', location.search_query)
    let urlEvent = `http://api.eventful.com/json/events/search?keywords=music&location=${location.search_query}&app_key=${eventAPI}`;
    superagent.get(urlEvent)
      .then(result => {
        let parsedData = JSON.parse(result.text);
        // console.log(parsedData)
        let eventList = parsedData.events.event
        let eventListing = eventList.map(value => {
          return new Event(value);
        });
        response.status(200).send(eventListing)
      })
      .catch(error => console.error(error))
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



///// app listener//////////
client.connect()
  .then(
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`))
  )
  .catch(err => {
    console.error(err)
  })


// app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
