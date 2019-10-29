'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const mw = require('../../../src/services/query-profile/src/query-options-mw');

describe('query-appointment query-options-mw unit tests', () => {
  it('should set the req.profileQueryOptions', () => {
    const next = stub();
    const req = {
      query: {
        select: 'test'
      }
    };
    mw(req, {}, next);
    expect(req.appointmentQueryOptions).to.deep.equal({
      select: 'test'
    });
  });

  it('should set the req.appointmentQueryOptions with lowercase', () => {
    const next = stub();
    const req = {
      query: {
        select: 'TEST'
      }
    };
    mw(req, {}, next);
    expect(req.appointmentQueryOptions).to.deep.equal({
      select: 'test'
    });
  });

  it('should not set any req.appointmentQueryOptions', () => {
    const next = stub();
    const req = {};
    mw(req, {}, next);
    expect(req.appointmentQueryOptions).to.equal();
  });
});
