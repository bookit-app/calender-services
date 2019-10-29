'use strict';

const winston = require('winston');

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
module.exports = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()]
});

// TODO: Setup MW: https://www.npmjs.com/package/@google-cloud/logging-winston
