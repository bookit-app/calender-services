'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {
  appointmentRepositoryInstance
} = require('../../../lib/repository/appointment-repository');
// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.get(
  '/appointment/:aid',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('./query-options-mw'),
  require('./query-appointment-mw')(appointmentRepositoryInstance)
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
