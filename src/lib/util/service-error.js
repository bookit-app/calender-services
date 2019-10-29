'use strict';

class ServiceError extends Error {
  constructor(error) {
    super();
    this.errorCode = error.errorCode;
    this.statusCode = error.statusCode;
    this.message = error.message;
    this.trace = error.traceId;
  }
}

module.exports = ServiceError;
