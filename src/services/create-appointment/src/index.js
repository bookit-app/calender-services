'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Setup Express Server
const app = express();
app.use(bodyParser.json());

let repo,
  createAppointmentMW,
  queryProviderMW,
  providerClient,
  validationMW,
  schema;

function createHandlerMW(req, res, next) {
  repo =
    repo ||
    require('../../../lib/repository/appointment-repository')
      .appointmentRepositoryInstance;
  createAppointmentMW =
    createAppointmentMW || require('./create-appointment-mw')(repo);
  return createAppointmentMW(req, res, next);
}

function validateMW(req, res, next) {
  repo =
    repo ||
    require('../../../lib/repository/appointment-repository')
      .appointmentRepositoryInstance;

  schema = schema || require('./payload-validations').schema;
  validationMW =
    validationMW || require('../../../lib/mw/payload-validation-mw')(schema);

  return validationMW(req, res, next);
}

function queryProviderHandlerMW(req, res, next) {
  providerClient =
    providerClient ||
    require('./client/provider-client').providerClientInstance;
  queryProviderMW =
    queryProviderMW || require('./query-service-provider-mw')(providerClient);
  return queryProviderMW(req, res, next);
}

// Generate Route with necessary middleware
app.post(
  '/appointments',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  validateMW,
  queryProviderHandlerMW,
  (req, res, next) => {
    res.appointment = req.body;
    next();
  },
  require('./extract-staff-info-mw'),
  require('./extract-service-info-mw'),
  createHandlerMW,
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
