'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services/create-appointment/src/extract-service-info-mw');

describe('create-appointment extract-service-info-mw unit tests', () => {
  it('should populate the styleId', () => {
    const res = {
      appointment: {},
      serviceProvider: {
        services: [{ serviceId: '1234', styleId: 'STYLE' }]
      }
    };

    const req = {
      body: {
        serviceId: '1234'
      }
    };
    const next = stub();
    mw(req, res, next);
    expect(res.appointment.styleId).to.equal('STYLE');
    expect(next.called).to.be.true;
  });

  it('should call next with a malformedRequest error if service is not found', () => {
    const res = {
      appointment: {},
      serviceProvider: {
        services: [{ serviceId: '1234', styledId: 'STYLE' }]
      }
    };

    const req = {
      body: {
        serviceId: '12345'
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
