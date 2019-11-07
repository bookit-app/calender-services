'use strict';

const { INTERNAL_SERVER_ERROR } = require('../constants').statusCodes;
/**
 * Express error middleware to properly format
 * a json response when errors are generated
 *
 * @param {ServiceError} err
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 */

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { errorCode, statusCode, message } = err;

  res.status(statusCode || INTERNAL_SERVER_ERROR).json({
    errorCode: errorCode || 'UNKNOWN',
    message
  });
};
