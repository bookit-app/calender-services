'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to query the staff members profile
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = providerClient => async (req, res, next) => {
  try {
    res.serviceProvider = await providerClient.queryProvider(
      req.body.providerId
    );

    if (isEmpty(res.serviceProvider)) {
      const error = clone(errors.malformedRequest);
      error.message = 'Provider ID is invalid';
      next(new ServiceError(error));
      return;
    }

    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
