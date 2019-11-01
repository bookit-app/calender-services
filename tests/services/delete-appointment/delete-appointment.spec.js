'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  delete: stub()
};
const mw = require('../../../src/services/delete-appointment/src/delete-appointment-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  }
};

const res = {};

afterEach(() => {});

describe('delete-appointment unit tests', () => {
  it('should delete the appointment', async () => {
    repoStub.delete.resolves();
    const next = stub();
    await mw(req, res, next);
    expect(repoStub.delete.calledWith('TEST-USER')).to.be.true;
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.delete.rejects(new Error('FORCED-ERROR'));
    const next = stub();
    await mw(req, res, next);
    expect(repoStub.delete.calledWith('TEST-USER')).to.be.true;
    expect(next.called).to.be.true;
    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.updateFailed.errorCode);
    expect(statusCode).to.equal(errors.updateFailed.statusCode);
  });
});
