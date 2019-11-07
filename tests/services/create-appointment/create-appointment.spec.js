'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  create: stub()
};
const mw = require('../../../src/services/create-appointment/src/create-appointment-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  body: {
    staffMemberId: 'TEST-STAFF-ID',
    providerId: 'TEST-PROVIDER-Id',
    time: '12:30',
    date: '12-10-2019'
  }
};

const res = {
  location: stub()
};

const next = stub();

describe('create-appointment: unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    res.location.resetHistory();
    repoStub.create.resetHistory();
  });

  it('should respond with a 201 when profile is created', () => {
    repoStub.create.resolves('DOC-ID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
          clientId: 'TEST-USER',
          staffMemberId: 'TEST-STAFF-ID',
          providerId: 'TEST-PROVIDER-Id',
          time: '12:30',
          date: '12-10-2019'
        })
      ).to.be.true;
      expect(res.location.calledWith('/appointments/DOC-ID')).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.create.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
          clientId: 'TEST-USER',
          staffMemberId: 'TEST-STAFF-ID',
          providerId: 'TEST-PROVIDER-Id',
          time: '12:30',
          date: '12-10-2019'
        })
      ).to.be.true;
      expect(res.location.called).to.be.false;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
