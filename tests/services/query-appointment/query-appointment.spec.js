'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByAppointmentId: stub()
};
const mw = require('../../../src/services/query-appointment/src/query-appointment-mw')(
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

const appointment = {
  appointmentId: 'TEST-APPT',
  staffMemberId: 'TEST-STAFF-ID',
  providerId: 'TEST-PROVIDER-Id',
  clientId: 'TEST-CLIENT-ID',
  time: '12:30',
  date: '12-10-2019',
  state: 'BOOKED'
};

const next = stub();

describe('query-appointment query-appointment-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
  });

  it('should call next when appointment is found and populate res.appointment', async () => {
    repoStub.findByAppointmentId.resolves(appointment);
    const res = {};
    await mw(req, res, next);
    expect(repoStub.findByAppointmentId.calledWith('TEST-APPT')).to.be.true;
    expect(res.appointment).to.deep.equal(appointment);
    expect(next.called).to.be.true;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByAppointmentId.rejects(new Error('FORCED-ERROR'));
    const res = {};
    await mw(req, res, next);
    expect(repoStub.findByAppointmentId.calledWith('TEST-APPT')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
