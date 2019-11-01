'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByProfileId: stub()
};
const mw = require('../../../src/services/query-appointment/src/query-appointment-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  }
};

const sendStub = stub();
const res = {
  status: stub().returns({ send: sendStub }),
  sendStatus: sendStub
};

const profile = {
  aid: 'TEST-AID',
  uid: 'TEST-UID',
  time: '12:30',
  date: '12-10-2019'
};

const next = stub();

afterEach(() => {
  sendStub.resetHistory();
  res.status.resetHistory();
  next.resetHistory();
});

describe('query-appointment unit tests', () => {
  it('should respond with OK and the appointment when found', async () => {
    repoStub.findByAppointmentId.resolves(appointment);
    await mw(req, res, next);
    expect(repoStub.findByAppointmentId.calledWith('TEST-USER')).to.be.true;
    expect(sendStub.calledWith(appointment));
    expect(res.status.calledWith(200));
    expect(next.called).to.be.false;
  });

  it('should respond with NOT_FOUND when no profile is found', async () => {
    repoStub.findByAppointmentId.resolves(undefined);
    await mw(req, res, next);
    expect(repoStub.findByProfileId.calledWith('TEST-USER')).to.be.true;
    expect(sendStub.calledWith(404));
    expect(next.called).to.be.false;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByAppointmentId.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findByAppointmentId.calledWith('TEST-USER')).to.be.true;
    expect(sendStub.called).to.be.false;
    expect(res.status.called).to.be.false;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
