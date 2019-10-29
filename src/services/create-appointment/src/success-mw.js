'use strict';

const { CREATED } = require('../../../lib/constants').statusCodes;

module.exports = (req, res) => {
  res.sendStatus(CREATED);
};
