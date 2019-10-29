'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { OK, NOT_FOUND } = require('../../../lib/constants').statusCodes;
const { clone, isEmpty } = require('../../../../node_modules/lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const appointment = await appointmentRepository.findByAppointmentId(
      req.apiUserInfo.id,
      req.appointmentQueryOptions
    );

    isEmpty(appointment) ? res.sendStatus(NOT_FOUND) : res.status(OK).send(appointment);
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
