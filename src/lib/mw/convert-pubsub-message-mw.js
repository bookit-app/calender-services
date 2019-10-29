'use strict';

module.exports = (req, res, next) => {
  const pubSubMessage = req.body.message;
  req.body = JSON.parse(Buffer.from(pubSubMessage.data, 'base64'));
  next();
};
