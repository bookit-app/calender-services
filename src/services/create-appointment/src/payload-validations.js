'use strict';

/**
 * Populates a specific dynamic async check to
 * determine if the EIN provided for thew new
 * service provider already exists. This will be trigger
 * automatically based on the schema validation with AJV
 *
 * @param {AJV} ajv
 * @param {ServiceProviderRepository} appointmentRepository
 */
module.exports.enableDynamicValidationChecks = (
  ajv,
  appointmentRepository
) => {
  ajv.addKeyword('aidExists', {
    async: true,
    type: 'string',
    validate: checkAidExists
  });

  async function checkAidExists(options, data) {
    const appointment = await appointmentRepository.findProviderByAid(data);
    return isEmpty(appointment);
  }
};


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
