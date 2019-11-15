'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to update the appointment with service information
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  const staff = res.serviceProvider.staff.find(
    member => member.staffMemberId === req.body.staffMemberId
  );

  if (isEmpty(staff)) {
    const error = clone(errors.malformedRequest);
    error.message = 'Staff Member ID is invalid';
    next(new ServiceError(error));
    return;
  }

  res.appointment.staffMemberName = staff.name;
  next();
};
