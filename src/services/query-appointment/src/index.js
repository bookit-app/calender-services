'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// These will be lazily loaded when needed.
// Per Cloud Run best practice we should lazily load
// references https://cloud.google.com/run/docs/tips
let repo, queryMW;

function queryHandlerMW(req, res, next) {
  repo =
    repo ||
    require('../../../lib/repository/appointment-repository')
      .appointmentRepositoryInstance;
  queryMW = queryMW || require('./query-appointment-mw')(repo);
  return queryMW(req, res, next);
}

const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.get(
  '/appointments/:appointmentId',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  queryHandlerMW,
  require('./success-mw')
);

app.use(require('../../../lib/mw/error-handling-mw'));

// Start up the server and listen on the provided port
app.listen(process.env.PORT, err => {
  if (err) {
    console.log(`Server failed to start due to ${err.message}`);
    return;
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
