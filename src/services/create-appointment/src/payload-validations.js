'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/appointment-create-schema.json',
  type: 'object',
  required: ['date', 'time', 'providerId', 'serviceId', 'staffMemberId'],
  additionalProperties: false,
  properties: {
    providerId: {
      type: 'string'
    },
    serviceId: {
      type: 'string'
    },
    staffMemberId: {
      type: 'string'
    },
    date: {
      type: 'string',
      format: 'date'
    },
    time: {
      type: 'string',
      format: 'time'
    },
    note: {
      type: 'string'
    }
  }
};
