'use strict';

////////lib
const client = require('../client')
require('dotenv').config()
const superagent = require('superagent')
const Location = require('./location_constructor')
const errorHandler =require('../errorhandler')
let location = {}

function locationHandler(request, response) {
  try {
    const geocod = process.env.GEOCODE_API_KEY;
    const city = request.query.city;
    var selectsql = `Select * FROM locationSearch WHERE search_query=$1;`;
    const safeValues = [city]
    client.query(selectsql, safeValues)
      .then(result => {
        if (result.rows.length > 0) {
          console.log('hit this database')
          response.status(200).json(result.rows[0]);
        } else {
          let urlLocation = `https://us1.locationiq.com/v1/search.php?key=${geocod}&q=${city}&format=json`
          superagent.get(urlLocation)
            .then(result => {
              const locationSearch = new Location(city, result.body);
              location = locationSearch;
              let sql = `INSERT INTO locationSearch (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *;`;
              let values = [city, location.formatted_query, location.latitude, location.longitude]
              client.query(sql, values)
                .then(results => {
                  response.status(200).json(location);
                  // response.send(location);
                })
                .catch(error => console.error('location handle is not working', error))
            })
        }
      }).catch(error => console.error(error))
  }
  catch (error) {
    errorHandler('So sorry, something went wrong.', request, response);
  }
}


module.exports = locationHandler;
