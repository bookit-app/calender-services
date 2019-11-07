'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/appointment-update-schema.json',
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
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
    },
    status: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          enum: ['DELAYED', 'ON-TIME', 'READY']
        },
        comment: {
          type: 'string'
        }
      }
    }
  }
};
