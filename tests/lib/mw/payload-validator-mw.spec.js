'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');

describe('payload-validation-mw unit tests', () => {
  const schema = {
    $async: true,
    $id: 'http://bookit.com/schemas/schema.json',
    type: 'object',
    required: ['field'],
    properties: {
      field: {
        type: 'string',
        pattern: '^[0-9]{2}-[0-9]{7}$'
      }
    }
  };

  const mw = require('../../../src/lib/mw/payload-validation-mw')(schema);

  it('should successfully pass the validation and call next for schema', () => {
    const req = {
      body: {
        field: '12-1234567'
      }
    };
    const next = stub();
    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(next.called).to.be.true;
      expect(next.calledWith()).to.be.true;
    });
  });

  it('should fail validations and call next with error', () => {
    const req = {
      body: {
        field: '12-14567'
      }
    };

    const next = stub();
    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(next.called).to.be.true;
      expect(next.args.length).to.equal(1);

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.malformedRequest.errorCode);
      expect(statusCode).to.equal(errors.malformedRequest.statusCode);
    });
  });
});
