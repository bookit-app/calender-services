'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to update the appointment with service information
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  const service = res.serviceProvider.services.find(
    service => service.serviceId === req.body.serviceId
  );

  if (isEmpty(service)) {
    const error = clone(errors.malformedRequest);
    error.message = 'Service ID is invalid';
    next(new ServiceError(error));
    return;
  }

  res.appointment.styleId = service.styleId;
  next();
};
