'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repo = {
  search: stub()
};
const mw = require('../../../src/services//appointment-search/src/appointment-search-mw')(
  repo
);

const results = [
  {
    businessName: 'Test Business',
    ownerUid: '057KyiBA50aXpjjeVXKdyIIkOmf1',
    ein: '43-2347647',
    address: {
      city: 'Palo Alto',
      state: 'CA',
      streetAddress: '1234 Home Street',
      zip: '98765'
    },
    phoneNumber: '123-123-1234',
    email: 'test@test.com'
  }
];

describe('appointment-search appointment-search-mw unit tests', () => {
  afterEach(() => {
    repo.search.resetHistory();
  });

  it('should return the requested appointments', async () => {
    const req = {
      searchOptions: {
        providerId: '12345'
      }
    };
    const sendStub = stub();
    const res = {
      status: stub().returns({
        send: sendStub
      })
    };
    const next = stub();
    repo.search.resolves(results);
    await mw(req, res, next);

    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(sendStub.called).to.be.true;
    expect(sendStub.calledWith(results)).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should raise an error if the repo has a failure', async () => {
    const req = {
      searchOptions: {
        providerId: '12345'
      }
    };
    const sendStub = stub();
    const res = {
      status: stub().returns({
        send: sendStub
      })
    };
    const next = stub();
    repo.search.rejects(new Error('FORCED ERROR'));
    await mw(req, res, next);

    expect(res.status.called).to.be.false;
    expect(sendStub.called).to.be.false;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
