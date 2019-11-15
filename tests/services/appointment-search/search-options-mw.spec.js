'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services//appointment-search/src/search-options-mw');

describe('appointment-search search-options-mw unit tests', () => {
  it('should populate the req.searchOptions when valid options are provided', () => {
    const req = {
      query: {
        providerId: '12345'
      }
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
    expect(req.searchOptions.providerId).to.equal('12345');
  });

  it('should ignore invalid search options', () => {
    const req = {
      query: {
        providerId: '12345',
        state: 'NY',
        skip: 'TO BE SKIPPED'
      }
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
    expect(req.searchOptions.providerId).to.equal('12345');
    expect(req.searchOptions.state).to.equal(undefined);
    expect(req.searchOptions.skip).to.equal(undefined);
  });

  it('should raise malformed request when no search parameters are valid', () => {
    const req = {
      query: {}
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });

  it('should populate the searchOptions.clientId', () => {
    const req = {
      apiUserInfo: {
        id: 'TEST-ID'
      },
      query: {
        providerId: '12345',
        mine: true
      }
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
    expect(req.searchOptions.providerId).to.equal('12345');
    expect(req.searchOptions.clientId).to.equal('TEST-ID');
  });

  it('should populate the searchOptions.clientId', () => {
    const req = {
      apiUserInfo: {
        id: 'TEST-ID'
      },
      query: {
        providerId: '12345',
        mine: 'true'
      }
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
    expect(req.searchOptions.providerId).to.equal('12345');
    expect(req.searchOptions.clientId).to.equal('TEST-ID');
  });
});
