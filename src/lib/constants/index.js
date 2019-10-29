'use strict';

const statusCode = require('http-status-codes');

module.exports = Object.freeze({
  statusCodes: statusCode,
  errors: {
    unauthorized: {
      errorCode: 'UNAUTHORIZED',
      statusCode: statusCode.UNAUTHORIZED,
      message: 'Authentication is required to access this endpoint'
    },
    malformedRequest: {
      errorCode: 'MALFORMED_REQUEST',
      statusCode: statusCode.BAD_REQUEST,
      message: 'Request is incorrect'
    },
    updateFailed: {
      errorCode: 'UPDATE_FAILED',
      statusCode: statusCode.BAD_REQUEST,
      message: 'Failed to save information'
    },
    systemError: {
      errorCode: 'SYSTEM_ERROR',
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: 'Oops something went wrong on our end.'
    }
  }
});
