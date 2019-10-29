'use strict';

const { isEmpty } = require('lodash');

/**
 * Extracts the trace ID info which was populated
 * by the ESP for Cloud Endpoints
 *
 * @param {Express.Request} req
 * @returns
 */
module.exports = (req, res, next) => {
  const traceHeader = req.header('X-Cloud-Trace-Context');

  if (isEmpty(traceHeader)) {
    next();
    return;
  }

  const [trace] = traceHeader.split('/');
  req.traceContext = trace;
  next();
};
