'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');
const { OK } = require('../../../lib/constants').statusCodes;

/**
 * Express Middleware to to trigger the search request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    const providers = await repository.search(req.searchOptions);
    res.status(OK).send(providers);
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
