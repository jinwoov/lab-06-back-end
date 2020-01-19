'use strict';

function Event(obj) {
  this.link = obj.url;
  this.name = obj.title;
  this.event_date = obj.start_time.slice(0, 11)
  this.summary = obj.description
}

module.exports = Event;
