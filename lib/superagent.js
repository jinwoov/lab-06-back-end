'use strict';

const superagent = require('superagent')
const Location = require('./location_constructor')


function superagentGet(url, key, search, onstructor) {
          superagent.get(url)
            .then(result => {
              const locationSearch = new constructor (city, result.body);
            }
        }

module.exports = superagentGet;
