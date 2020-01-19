'use strict';

///connect express to our server.js////
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());

///////////lib////////////////
const locationHandler = require('./lib/location/location')
const client = require('./lib/client')
const weatherHandler = require('./lib/weather/weather')
const notFoundHandler = require('./lib/errorhandler')
const errorHandler = require('./lib/errorhandler')
const eventHandler = require('./lib/event/event')

//////////////////////////\\\\\\\\\\\\\\\\\\\\\\\
app.get('/location', locationHandler)
app.get('/weather', weatherHandler)
app.get('/events', eventHandler)
app.get('/movies', movieHandler)
app.get('/yelp', yelpHandler)
app.get('/trails', trailHandler)










function movieHandler(request, response) {
  try {
    let { search_query } = request.query;
    const event = process.env.MOVIE_API_KEY;
    let urlMoive = `https://api.themoviedb.org/3/search/movie?language=en-US&api_key=${event}&query=${search_query}`;
    superagent.get(urlMoive)
      .then(result => {
        let movieResult = result.body.results;
        let movieList = movieResult.map(value => {
          return new MovieDB(value)
        })
        response.status(200).send(movieList)
      }).catch(error => console.error('this is error from weather', error))
  } catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
}

function yelpHandler(request, response) {
  try {
    let {search_query} = request.query;
    const yelpKey = process.env.YELP_API_KEY;
    // console.log(yelpKey)
    let myUrl = `https://api.yelp.com/v3/businesses/search?restaurant&location=${search_query}}`;
    superagent.get(myUrl)
      .set('Authorization', `Bearer ${yelpKey}`)
      .then(result => {
        let parsedData = JSON.parse(result.text)
        let yelpList = parsedData.businesses.map(value => {
          return new yelpAPI(value)
        })
        response.status(200).send(yelpList)
      }).catch(error => console.error('this is error from weather', error))
  } catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
}

function trailHandler(request, response) {
  try {
    let {longitude,latitude} = request.query;
    const hikeKey = process.env.TRAIL_API_KEY;
    // console.log(yelpKey)
    let myUrl = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${hikeKey}`;
    superagent.get(myUrl)
      .then(result => {
        let parsedData = JSON.parse(result.text)
        let trailList = parsedData.trails.map(value => {
          return new trailAPI(value)
        })
        // console.log(trailList)
        response.status(200).send(trailList)
      }).catch(error => console.error('this is error from weather', error))
  } catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
}


//////////Constructors////////

function MovieDB(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.vote_average;
  this.total_votes = movie.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  this.popularity = movie.popularity;
  this.released_on = movie.release_date;
}

function yelpAPI(restaurant) {
  this.name = restaurant.name;
  this.image_url = restaurant.image_url;
  this.price = restaurant.price;
  this.rating = restaurant.rating;
  this.url = restaurant.url;
}

function trailAPI(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionDetails;
  this.condition_date = trail.conditionDate.slice(0,10);
  this.condition_time = trail.conditionDate.slice(12,19);
}

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

