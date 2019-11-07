'use strict';

const ServiceError = require('../../../lib/util/service-error');
const { errors } = require('../../../lib/constants');
const { clone } = require('../../../../node_modules/lodash');

/**
 * Express Middleware to trigger the creation of the
 * appointment. It assumes the data is pre-validated
 * and the request object is containing the necessary user details
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */

module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const appointment = req.body;
    appointment.clientId = req.apiUserInfo.id;
    const docId = await appointmentRepository.create(appointment);

    console.log(
      `Appointment for client ${appointment.clientId} successfully created`
    );

    res.location(`/appointments/${docId}`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    error.traceId = req.traceContext;
    next(new ServiceError(error));
  }
};
