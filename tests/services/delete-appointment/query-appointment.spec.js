'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByAppointmentId: stub()
};
const mw = require('../../../src/services/delete-appointment/src/query-appointment-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-CLIENT-ID'
  },
  params: {
    appointmentId: 'TEST-APPT'
  }
};

const sendStub = stub();
const res = {
  status: stub().returns({ send: sendStub }),
  sendStatus: sendStub
};

const appointment = {
  appointmentId: 'TEST-APPT',
  staffMemberId: 'TEST-STAFF-ID',
  providerId: 'TEST-PROVIDER-Id',
  clientId: 'TEST-CLIENT-ID',
  time: '12:30',
  date: '12-10-2019'
};

const next = stub();

afterEach(() => {
  sendStub.resetHistory();
  res.status.resetHistory();
  next.resetHistory();
});

describe('delete-appointment query-appointment-mw unit tests', () => {
  it('should call next when appointment is found', async () => {
    repoStub.findByAppointmentId.resolves(appointment);
    await mw(req, res, next);
    expect(repoStub.findByAppointmentId.calledWith('TEST-APPT')).to.be.true;
    expect(sendStub.called).to.be.false;
    expect(res.status.called).to.be.false;
    expect(next.called).to.be.true;
  });

  it('should respond with NOT_FOUND when no appointment is found', async () => {
    repoStub.findByAppointmentId.resolves(undefined);
    await mw(req, res, next);
    expect(repoStub.findByAppointmentId.calledWith('TEST-APPT')).to.be.true;
    expect(sendStub.calledWith(404));
    expect(next.called).to.be.false;
  });

  it('should respond with NOT_FOUND when appointment clientId is not the current user', async () => {
    repoStub.findByAppointmentId.resolves({
      clentId: 'SOMEONE-ELSe'
    });

    await mw(req, res, next);
    expect(repoStub.findByAppointmentId.calledWith('TEST-APPT')).to.be.true;
    expect(sendStub.calledWith(404));
    expect(next.called).to.be.false;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByAppointmentId.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findByAppointmentId.calledWith('TEST-APPT')).to.be.true;
    expect(sendStub.called).to.be.false;
    expect(res.status.called).to.be.false;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
