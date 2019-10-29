'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {
  applicationRepositoryInstance
} = require('../../../lib/repository/appointment-repository');
const { schema } = require('./payload-validations');

// Setup Express Server
const app = express();
app.use(bodyParser.json());

let repo, createAppointmentMW, validationMW, schema;

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

  if (!validationMW) {
    require('./payload-validations').enableDynamicValidationChecks(
      require('../../../lib/util/validator'),
      repo
    );
  }

  schema = schema || require('./payload-validations').schema;
  validationMW =
    validationMW || require('../../../lib/mw/payload-validation-mw')(schema);

  return validationMW(req, res, next);
}

// Generate Route with necessary middleware
app.post(
  '/appointments',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('../../../lib/mw/payload-validation-mw')(schema),
  require('./create-appointments-mw')(applicationRepositoryInstance),
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
