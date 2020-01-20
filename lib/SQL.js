'use strict';

function createSQLabel(variable) {
  var selectsql = `Select * FROM locationSearch WHERE search_query=$1;`;

  var label = `INSERT INTO locationSearch (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *;`;

  return variable === 'select' ? selectsql
    : label
}


module.exports = createSQLabel;
