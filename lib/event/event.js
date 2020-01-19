'use strict';

const superagent = require('superagent')
const errorHandler =require('../errorhandler')
const Event = require('./event_constructor')

function eventHandler(request, response) {
  try {
    let { search_query } = request.query
    const eventAPI = process.env.EVENTFUL_API_KEY;
    // console.log('search_query', location.search_query)
    let urlEvent = `http://api.eventful.com/json/events/search?keywords=music&location=${search_query}&app_key=${eventAPI}`;
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
      .catch(error => console.error('this is error from weather', error))
  } catch (error) {
    errorHandler('So sorry, something is acting up.', request, response);
  }
}

module.exports = eventHandler;