'use strict';

const { NO_CONTENT } = require('../../../lib/constants').statusCodes;

module.exports = (req, res) => {
  res.sendStatus(NO_CONTENT);
};
