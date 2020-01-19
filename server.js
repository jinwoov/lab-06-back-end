'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());

///////////lib////////////////
const locationHandler = require('./lib/location/location');
const client = require('./lib/client');
const weatherHandler = require('./lib/weather/weather');
const notFoundHandler = require('./lib/errorhandler');
const errorHandler = require('./lib/errorhandler');
const eventHandler = require('./lib/event/event');
const movieHandler = require('./lib/movie/movie');
const yelpHandler = require('./lib/yelp/yelp');
const trailHandler = require('./lib/trail/trail');

//////////////////////////\\\\\\\\\\\\\\\\\\\\\\\
app.get('/location', locationHandler)
app.get('/weather', weatherHandler)
app.get('/events', eventHandler)
app.get('/movies', movieHandler)
app.get('/yelp', yelpHandler)
app.get('/trails', trailHandler)

/////////// Error functions///////////
app.use('*', notFoundHandler);
app.use(errorHandler);


///// app listener//////////
client.on('error', err => console.error(err))
client.connect()
  .then(
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`))
  )
  .catch(err => {
    throw `this is website error ${err.message}`
  })

