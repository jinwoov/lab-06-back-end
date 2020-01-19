'use strict';

const superagent = require('superagent')
const errorHandler =require('../errorhandler')
const trailAPI = require('./trail_constructor')

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

module.exports = trailHandler;
