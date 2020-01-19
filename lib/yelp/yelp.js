'use strict';

const superagent = require('superagent')
const errorHandler =require('../errorhandler')
const YelpAPI = require('./yelp_constructor')

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
          return new YelpAPI(value)
        })
        response.status(200).send(yelpList)
      }).catch(error => console.error('this is error from weather', error))
  } catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
}

module.exports = yelpHandler;

