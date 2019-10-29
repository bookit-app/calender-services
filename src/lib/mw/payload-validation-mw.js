'use strict';

const ServiceError = require('../util/service-error');
const { errors } = require('../constants');
const { clone } = require('lodash');
const ajv = require('../util/validator');

let validateFunction;
/**
 * Payload validation MW based on AJV and JSON Schemas
 *
 * @param {*} schema
 */

module.exports = schema => {
  validateFunction = ajv.compile(schema);
  return validationMW;
};

/**
 * Handles the validation of the req.body based on the
 * provided schema
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
async function validationMW(req, res, next) {
  try {
    await validateFunction(req.body);
    next();
  } catch (err) {
    return handleError(err, next);
  }
}

/**
 * Error handler for populating and raising the errors
 *
 * @param {Error} err
 * @param {Express.next} next
 * @returns
 */
function handleError(err, next) {
  const error = clone(errors.malformedRequest);
  error.message = ajv.errorsText(err.errors);
  next(new ServiceError(error));
  return;
}
