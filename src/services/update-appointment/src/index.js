'use strict';

const express = require('express');
const bodyParser = require('body-parser');

let repo, updateAppointmentMW, validateMW, schema;

function updateHandlerMW(req, res, next) {
  repo =
    repo ||
    require('../../../lib/repository/appointment-repository')
      .appointmentRepositoryInstance;
  updateAppointmentMW =
    updateAppointmentMW || require('./update-appointment-mw')(repo);
  return updateAppointmentMW(req, res, next);
}

function validateHandlerMW(req, res, next) {
  schema = schema || require('./payload-validations').schema;
  validateMW =
    validateMW || require('../../../lib/mw/payload-validation-mw')(schema);
  return validateMW(req, res, next);
}

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.patch(
  '/appointments/:appointmentId',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  validateHandlerMW,
  updateHandlerMW,
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
