'use strict';

const { isEmpty } = require('lodash');
const { NOT_FOUND, OK } = require('../../../lib/constants').statusCodes;
/**
 * Express Middleware to create the response body
 * the rest of the MW chain depends on this to exist
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
module.exports = (req, res) => {
  isEmpty(res.appointment) || res.appointment.clientId !== req.apiUserInfo.id
    ? res.sendStatus(NOT_FOUND)
    : res.status(OK).send(res.appointment);
};
