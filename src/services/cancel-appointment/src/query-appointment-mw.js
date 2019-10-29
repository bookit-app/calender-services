'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { NOT_FOUND } = require('../../../lib/constants').statusCodes;
const { clone, isEmpty } = require('../../../../node_modules/lodash');

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const appointment = await appointmentRepository.findByAppointmentId(req.apiUserInfo.id);
    isEmpty(appointment) ? res.sendStatus(NOT_FOUND) : next();
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
