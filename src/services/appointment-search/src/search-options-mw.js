'use strict';

const { clone, isEmpty } = require('../../../../node_modules/lodash');
const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error.js');
const {
  supportedSearchParams
} = require('../../../lib/repository/appointment-repository');

module.exports = (req, res, next) => {
  if (!isEmpty(req.query)) {
    req.searchOptions = supportedSearchParams.reduce(
      (options, supportedParam) => {
        if (!isEmpty(req.query[supportedParam])) {
          options[supportedParam] = req.query[supportedParam];
        }
        return options;
      },
      {}
    );
  }

  if (req.query.mine === true || req.query.mine === 'true') {
    req.searchOptions.clientId = req.apiUserInfo.id;
  }

  if (isEmpty(req.searchOptions)) {
    const error = clone(errors.malformedRequest);
    error.message = 'No supported query parameters found in request';
    next(new ServiceError(error));
    return;
  }

  next();
};
