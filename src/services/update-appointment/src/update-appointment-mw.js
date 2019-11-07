'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const appointment = req.body;
    await appointmentRepository.update(req.params.appointmentId, appointment);

    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
