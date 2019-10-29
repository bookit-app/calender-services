'use strict';

const { OK } = require('../../../lib/constants').statusCodes;

module.exports = (req, res) => {
  res.sendStatus(OK);
};
