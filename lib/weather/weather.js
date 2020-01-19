'use strict';

////////lib/////////
const errorHandler = require('../errorhandler')
const superagent = require('superagent')
const Weather = require('./weather_constructor')


function weatherHandler(request, response) {
  try {
    const weatherAPI = process.env.WEATHER_API_KEY;
    let { latitude, longitude } = request.query;
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
}

module.exports = weatherHandler;
