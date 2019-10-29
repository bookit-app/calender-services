'use strict';

const { isEmpty } = require('lodash');
const ServiceError = require('../util/service-error');
const { errors } = require('../constants');

/**
 * Extracts the user information which was populated
 * by the ESP for Cloud Endpoints
 *
 * @param {Express.Request} req
 * @returns
 */
module.exports = (req, res, next) => {
  const endpointApiUserInfo = req.header('X-Endpoint-API-UserInfo');

  if (isEmpty(endpointApiUserInfo)) {
    next(new ServiceError(errors.unauthorized));
    return;
  }

  req.apiUserInfo = JSON.parse(
    Buffer.from(endpointApiUserInfo, 'base64').toString()
  );

  next();
};
