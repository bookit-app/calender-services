'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    await appointmentRepository.delete(req.apiUserInfo.id);
    console.log(`Appointment ${req.apiUserInfo.id} successfully cancelled`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
