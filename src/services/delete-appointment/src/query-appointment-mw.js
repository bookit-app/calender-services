'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { NOT_FOUND } = require('../../../lib/constants').statusCodes;
const { clone, isEmpty } = require('lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const appointment = await appointmentRepository.findByAppointmentId(
      req.params.appointmentId
    );

    isEmpty(appointment) || appointment.clientId !== req.apiUserInfo.id
      ? res.sendStatus(NOT_FOUND)
      : next();
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
