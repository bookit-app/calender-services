'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/appointment-update-schema.json',
  type: 'object',
  required: ['date', 'time', 'aid', 'uid', 'businessName'],
  properties: {
    date: {
      type: 'string',
      format: 'date'
    },
    time: {
      type: 'string',
      format: 'time'
    },
    aid: {
      type: 'string',
      pattern: '^[0-9]{6}$'
    },
    uid: {
      type: 'string',
      pattern: '^[0-9]{6}$'
    },
  
    businessName: {
      type: 'string',
      minLength: 1
    },
    
  }
};
