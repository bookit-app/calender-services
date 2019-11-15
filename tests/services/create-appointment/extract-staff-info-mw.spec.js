'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services/create-appointment/src/extract-staff-info-mw');

describe('create-appointment extract-staff-info-mw unit tests', () => {
  it('should populate the styleId', () => {
    const res = {
      appointment: {},
      serviceProvider: {
        staff: [{ staffMemberId: '1234', name: 'STAFF MEMBER' }]
      }
    };

    const req = {
      body: {
        staffMemberId: '1234'
      }
    };
    const next = stub();
    mw(req, res, next);
    expect(res.appointment.staffMemberName).to.equal('STAFF MEMBER');
    expect(next.called).to.be.true;
  });

  it('should call next with a malformedRequest error if service is not found', () => {
    const res = {
      appointment: {},
      serviceProvider: {
        staff: [{ staffMemberId: '1234', name: 'STAFF MEMBER' }]
      }
    };

    const req = {
      body: {
        staffMemberId: '12345'
      }
    };
    const next = stub();
    mw(req, res, next);
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });
});
