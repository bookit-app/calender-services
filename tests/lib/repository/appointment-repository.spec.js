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
 
  date: '2018-11-13',
  email: 'test@test.com',
  firstName: 'test-first-name',
  gender: 'M',
  isProvider: true,
  isSocial: true,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234',
  aid: 'TEST-AID',
  uid: 'TEST-UID',
  time: '12:30'
  
};

describe('appointment-repository: unit tests', () => {
  let repo;
  let collectionReference, documentReference;

  before(() => {
    const firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    collectionReference.doc.returns(documentReference);
    firestore.collection.returns(collectionReference);

    repo = new AppointmentRepository(firestore);
  });

  afterEach(() => {
    documentReference.get.resetHistory();
    documentReference.set.resetHistory();
    documentReference.delete.resetHistory();
    documentReference.create.resetHistory();
    collectionReference.doc.resetHistory();
  });

  context('create', () => {
    it('create should resolve', () => {
      documentReference.create.resolves();
      return expect(repo.create(appointment)).to.be.fulfilled;
    });

    it('should enforce default values on create', () => {
      const testAppointment = {
        aid: '',
        uid: '',
        time: '12:30',
        date: '12-10-2019'
      };

      documentReference.create.resolves();
      return expect(repo.create(testAppointment)).to.be.fulfilled.then(
        () =>
          expect(
            documentReference.create.calledWith({
              aid: '',
              uid: '',
              time: '12:30',
              date: '12-10-2019'
            })
          ).to.be.true
      );
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
    it('should return profile when found', () => {
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

    it('should return profile the request sub components when found', () => {
      documentReference.get.resolves({
        data: () => appointment,
        exists: true
      });

      expect(
        repo.findByAppointmentId(appointment.aid, { select: 'date' })
      ).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({
          aid: 'TEST-AID',
        uid: 'TEST-UID',
        time: '12:30',
        date: '12-10-2019'
          }
        );
      });
    });

    it('should return nothing if the request sub components are not found', () => {
      documentReference.get.resolves({
        data: () => appointment,
        exists: true
      });

      expect(
        repo.findByAppointmentId(appointment.aid, { select: 'test' })
      ).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({});
      });
    });

    it('should return undefined when no profile is found', () => {
      documentReference.get.resolves({
        data: () => {},
        exists: false
      });

      expect(repo.findByAppointmentId(appointment.aid)).to.be.fulfilled.then(
        response => {
          expect(response).to.be.undefined;
        }
      );
    });
  });

  context('update', () => {
    it('should resolve', () => {
      documentReference.set.resolves();
      expect(repo.update(appointment)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith(appointment.aid)).to.be.true;
        expect(
          documentReference.set.calledWith({
            aid: 'TEST-AID',
            uid: 'TEST-UID',
           time: '12:30',
            date: '12-10-2019'
          })
        ).to.be.true;
      });
    });
  });
});
