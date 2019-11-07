'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('../../../../node_modules/lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    res.appointment = await appointmentRepository.findByAppointmentId(
      req.params.appointmentId
    );
    next();
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
