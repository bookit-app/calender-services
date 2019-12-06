'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const AppointmentRepository = require('../../../src/lib/repository/appointment-repository');
const {
  CollectionReference,
  DocumentReference,
  Firestore
} = require('@google-cloud/firestore');

const appointment = {
  staffMemberId: 'TEST-STAFF-ID',
  providerId: 'TEST-PROVIDER-Id',
  clientId: 'TEST-CLIENT-ID',
  time: '12:30',
  date: '12-10-2019'
};

describe('appointment-repository: unit tests', () => {
  let repo, firestore;
  let collectionReference, documentReference;

  before(() => {
    firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    collectionReference.doc.returns(documentReference);
    documentReference.collection.returns(collectionReference);
    firestore.collection.returns(collectionReference);

    repo = new AppointmentRepository(firestore);
  });

  afterEach(() => {
    documentReference.get.resetHistory();
    documentReference.set.resetHistory();
    documentReference.delete.resetHistory();
    documentReference.create.resetHistory();
    collectionReference.doc.resetHistory();
    collectionReference.where.resetHistory();
    collectionReference.select.resetHistory();
    collectionReference.get.resetHistory();
    documentReference.collection.resetHistory();
    documentReference.create.resetHistory();
    collectionReference.add.resetHistory();
    firestore.runTransaction.resetHistory();
    documentReference.delete.resetHistory();
  });

  context('create', () => {
    it('should resolve if not existing appointment', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      collectionReference.where.returns(collectionReference);
      collectionReference.get.resolves({
        empty: true
      });

      documentReference.create.resolves();
      collectionReference.doc.returns({ id: 'TEST' });
      expect(repo.create(appointment)).to.be.fulfilled.then(documentId => {
        expect(
          documentReference.create.calledWith(
            { id: 'TEST' },
            {
              ...appointment,
              state: 'BOOKED'
            }
          )
        ).to.be.true;
        expect(documentId).to.equal('TEST');
        collectionReference.doc.returns(documentReference);
      });
    });

    it('should reject if appointment does exists', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      collectionReference.where.returns(collectionReference);
      collectionReference.get.resolves({
        empty: false
      });

      expect(repo.create(appointment)).to.be.rejected.then(err => {
        expect(documentReference.create.called).to.be.false;
        expect(err.code).to.equal('APPOINTMENT_ALREADY_EXISTING');
      });
    });
  });

  context('delete', () => {
    it('should resolve', () => {
      documentReference.delete.resolves();
      return expect(repo.delete(appointment.uid)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith(appointment.uid)).to.be.true;
      });
    });
  });

  context('query appointment', () => {
    it('should return appointment when found', () => {
      documentReference.get.resolves({
        data: () => appointment,
        exists: true
      });

      expect(repo.findByAppointmentId(appointment.aid)).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal(appointment);
        }
      );
    });

    it('should return {} when no appointment is found', () => {
      documentReference.get.resolves({
        data: () => {},
        exists: false
      });

      expect(repo.findByAppointmentId(appointment.aid)).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal({});
        }
      );
    });
  });
  context('update', () => {
    it('should resolve if appointment exists', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      documentReference.get.resolves({
        data: () => appointment,
        exists: true
      });

      documentReference.set.resolves();
      expect(repo.update('TEST', appointment)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith('TEST')).to.be.true;
        expect(documentReference.set.called).to.be.true;
      });
    });

    it('should reject if provider does not exists', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      documentReference.get.resolves({
        exists: false
      });

      documentReference.set.resolves();
      expect(repo.update('TEST', appointment)).to.be.rejected.then(err => {
        expect(collectionReference.doc.calledWith('TEST')).to.be.true;
        expect(documentReference.set.called).to.be.false;
        expect(err.code).to.equal('APPOINTMENT_NOT_EXISTING');
      });
    });
  });

  context('findByAppointmentId', () => {
    it('should return provider when found', () => {
      documentReference.get.resolves({
        id: 'TEST-ID',
        data: () => appointment,
        exists: true
      });

      expect(repo.findByAppointmentId('APPT-ID')).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal(appointment);
        }
      );
    });

    it('should return empty object when nothing is found', () => {
      documentReference.get.resolves({
        exists: false
      });

      expect(repo.findByAppointmentId('APPT-ID')).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal({});
        }
      );
    });

    it('should return empty object when doc reference is undefined', () => {
      documentReference.get.resolves(undefined);

      expect(repo.findByAppointmentId('APPT-ID')).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal({});
        }
      );
    });
  });

  context('search', () => {
    const options = {
      providerId: 'TEST-PROVIDER-Id',
      fromDate: '2020-01-01',
      staffMemberId: 'TEST-STAFF-ID',
      toDate: '2020-01-10',
      clientId: 'CLIENTID'
    };

    const results = [
      {
        id: 'appointment-id',
        data: () => appointment
      }
    ];

    it('should return the results', () => {
      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([
          {
            appointmentId: 'appointment-id',
            staffMemberId: 'TEST-STAFF-ID',
            providerId: 'TEST-PROVIDER-Id',
            clientId: 'TEST-CLIENT-ID',
            time: '12:30',
            date: '12-10-2019'
          }
        ]);
        expect(query.where.calledWith('providerId')).to.be.true;
        expect(query.where.calledWith('clientId')).to.be.true;
        expect(query.where.calledWith('staffMemberId')).to.be.true;
        expect(query.where.calledWith('date')).to.be.true;
      });
    });

    it('should return and empty array', () => {
      const snapshot = {
        empty: true
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([]);
        expect(query.where.calledWith('providerId')).to.be.true;
        expect(query.where.calledWith('clientId')).to.be.true;
        expect(query.where.calledWith('staffMemberId')).to.be.true;
        expect(query.where.calledWith('date')).to.be.true;
      });
    });

    it('should return all records if empty options are provided', () => {
      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search({})).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([
          {
            appointmentId: 'appointment-id',
            staffMemberId: 'TEST-STAFF-ID',
            providerId: 'TEST-PROVIDER-Id',
            clientId: 'TEST-CLIENT-ID',
            time: '12:30',
            date: '12-10-2019'
          }
        ]);
        expect(query.where.calledWith('providerId')).to.be.false;
        expect(query.where.calledWith('clientId')).to.be.false;
        expect(query.where.calledWith('staffMemberId')).to.be.false;
        expect(query.where.calledWith('date')).to.be.false;
      });
    });

    it('should return and all records if no options are provided', () => {
      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search()).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([
          {
            appointmentId: 'appointment-id',
            staffMemberId: 'TEST-STAFF-ID',
            providerId: 'TEST-PROVIDER-Id',
            clientId: 'TEST-CLIENT-ID',
            time: '12:30',
            date: '12-10-2019'
          }
        ]);
        expect(query.where.calledWith('providerId')).to.be.false;
        expect(query.where.calledWith('clientId')).to.be.false;
        expect(query.where.calledWith('staffMemberId')).to.be.false;
        expect(query.where.calledWith('date')).to.be.false;
      });
    });
  });
});
