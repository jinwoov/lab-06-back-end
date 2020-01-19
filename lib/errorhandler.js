'use strict';


function notFoundHandler(request, response) {
  response.status(404).send('this route does not compute?!?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = notFoundHandler;
module.exports = errorHandler;

