'use strict';

const superagent = require('superagent')
const errorHandler =require('../errorhandler')
const MovieDB = require('./movie_constructor')

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

module.exports = movieHandler;
