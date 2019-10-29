'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');
const { OK } = require('../../../lib/constants').statusCodes;

/**
 * Express Middleware to to trigger the query request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = appointmentRepository => async (req, res, next) => {
  try {
    const config = await appointmentRepository.query(req.configQueryOptions.type);
    res.status(OK).send(config);
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
