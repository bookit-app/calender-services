'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const appointment = req.body;
    appointment.uid = req.apiUserInfo.id;
    await appointmentRepository.update(appointment);

    console.log(`Appointment for UID ${appointment.uid} successfully updated`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
