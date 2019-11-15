'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const clientStub = {
  queryProvider: stub()
};
const mw = require('../../../src/services/create-appointment/src/query-service-provider-mw')(
  clientStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID',
    email: 'test@test.com'
  },
  body: {
    providerId: 'TEST-PROVIDER-UID'
  }
};

const provider = {
  sample: 'DATA'
};

const next = stub();

describe('create-appointment query-service-provider-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    clientStub.queryProvider.resetHistory();
  });

  it('should retrieve the provider from the client', async () => {
    const res = {};
    clientStub.queryProvider.resolves(provider);
    await mw(req, res, next);
    expect(clientStub.queryProvider.calledWith('TEST-PROVIDER-UID')).to.be.true;
    expect(res.serviceProvider).to.deep.equal(provider);
    expect(next.called).to.be.true;
  });

  it('should call next with malformed error if provider is not found', async () => {
    const res = {};
    clientStub.queryProvider.resolves({});
    await mw(req, res, next);
    expect(clientStub.queryProvider.calledWith('TEST-PROVIDER-UID')).to.be.true;
    expect(res.serviceProvider).to.deep.equal({});
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });

  it('should raise UPDATE-FAILED if failure occurs from repo', async () => {
    clientStub.queryProvider.rejects(new Error('FORCED-ERROR'));
    await mw(req, {}, next);
    expect(clientStub.queryProvider.calledWith('TEST-PROVIDER-UID')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.updateFailed.errorCode);
    expect(statusCode).to.equal(errors.updateFailed.statusCode);
  });
});
