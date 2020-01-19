'use strict';

function Location(apple, banana) {
  this.search_query = apple;
  this.formatted_query = banana[0].display_name;
  this.latitude = banana[0].lat;
  this.longitude = banana[0].lon;
}

module.exports = Location;
