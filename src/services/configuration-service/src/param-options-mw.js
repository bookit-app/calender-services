'use strict';

const { clone, camelCase } = require('../../../../node_modules/lodash');
const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error.js');
const { supportedTypes } = require('../../../lib/repository/config-repository');

module.exports = (req, res, next) => {
  const type = camelCase(req.params.config);

  if (supportedTypes.includes(type)) {
    req.configQueryOptions = {
      type: type
    };

    next();
  } else {
    const error = clone(errors.malformedRequest);
    error.message = `Configuration type ${type} not supported`;
    next(new ServiceError(error));
  }
};
