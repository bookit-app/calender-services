'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  update: stub(),
  delete: stub()
};
const mw = require('../../../src/services/update-appointment/src/update-appointment-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  params: {
    appointmentId: 'TEST-APPT'
  },
  body: {
    time: '12:30',
    date: '12-10-2019'
  }
};

const res = {};

const next = stub();

describe('update-appointment: unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.update.resetHistory();
  });

  it('should respond with a 200 when appointment is updated', () => {
    repoStub.update.resolves();
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST-APPT', {
          time: '12:30',
          date: '12-10-2019'
        })
      ).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should respond with a 200 and delete appointment when status is CANCELLED', () => {
    repoStub.delete.resolves();
    expect(
      mw(
        {
          apiUserInfo: {
            id: 'TEST-USER'
          },
          params: {
            appointmentId: 'TEST-APPT'
          },
          body: {
            state: 'CANCELLED'
          }
        },
        res,
        next
      )
    ).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(repoStub.delete.calledWith('TEST-APPT')).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.update.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST-APPT', {
          time: '12:30',
          date: '12-10-2019'
        })
      ).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
