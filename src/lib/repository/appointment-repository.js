'use strict';

const { isEmpty } = require('lodash');
const APPOINTMENT = 'appointments';
const supportedSearchParams = [
  'providerId',
  'fromDate',
  'toDate',
  'staffMemberId'
];

class AppointmentRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Create the appointment document
   *
   * @param {*} appointment
   * @returns {String}
   * @memberof AppointmentRepository
   */
  async create(appointment) {
    const snapshotReference = this.firestore
      .collection(APPOINTMENT)
      .where('staffMemberId', '==', appointment.staffMemberId)
      .where('date', '==', appointment.date)
      .where('time', '==', appointment.time);

    return this.firestore.runTransaction(async t => {
      const snapshot = await snapshotReference.get();

      if (snapshot && !snapshot.empty) {
        // There is already an existing appointment
        const err = new Error();
        err.code = 'APPOINTMENT_ALREADY_EXISTING';
        err.message = 'Appointment for time slot already exists.';
        return Promise.reject(err);
      }

      const documentReference = this.firestore
        .collection(APPOINTMENT)
        .doc();

      await t.create(documentReference, {
        ...appointment,
        state: 'BOOKED'
      });

      return documentReference.id;
    });
  }

  /**
   * Trigger the delete into Firestore for the document at
   * path profile/{profileId}
   *
   * @param {String} appointmentId
   * @returns
   * @memberof appointmentRepository
   */
  async delete(appointmentId) {
    await this.firestore
      .collection(APPOINTMENT)
      .doc(appointmentId)
      .delete();

    return;
  }

  async findByAppointmentId(appointmentId) {
    const documentReference = await this.firestore
      .collection(APPOINTMENT)
      .doc(appointmentId)
      .get();

    if (isEmpty(documentReference) || !documentReference.exists) {
      return {};
    }

    const document = documentReference.data();
    document.appointmentId = documentReference.id;
    return document;
  }

  update(appointmentId, appointment) {
    const documentReference = this.firestore
      .collection(APPOINTMENT)
      .doc(appointmentId);

    return this.firestore.runTransaction(async t => {
      const document = await t.get(documentReference);

      // The appointment has been deleted so nothing to update at this point
      if (isEmpty(document) || !document.exists) {
        const err = new Error();
        err.code = 'APPOINTMENT_NOT_EXISTING';
        return Promise.reject(err);
      }

      await t.set(documentReference, appointment, { merge: true });
    });
  }

  /**
   * Search for Appointments based on the input options
   * available options are defined in supportedSearchParams
   *
   * @param {*} options
   * @returns
   * @memberof ServiceProviderRepository
   */
  async search(options) {
    const collection = this.firestore.collection(APPOINTMENT);
    const query = buildSearchRequest(collection, options);

    const querySnapshot = await query.get();

    if (querySnapshot && !querySnapshot.empty) {
      return querySnapshot.docs.reduce((results, docSnapshot) => {
        const item = processSearchResultItem(docSnapshot);
        results.push(item);
        return results;
      }, []);
    }

    return [];
  }
}

function processSearchResultItem(documentSnapshot) {
  const data = documentSnapshot.data();
  data.appointmentId = documentSnapshot.id;
  return data;
}

/**
 * Processes the options for query and builds a firestore
 * query request which can be used
 *
 * @param {*} collection
 * @param {*} options
 * @returns {Query}
 */
function buildSearchRequest(collection, options) {
  let query = collection;

  if (!options) return query;

  if (options.clientId) {
    query = query.where('clientId', '==', options.clientId);
  }

  if (options.providerId) {
    query = query.where('providerId', '==', options.providerId);
  }

  if (options.staffMemberId) {
    query = query.where('staffMemberId', '==', options.staffMemberId);
  }

  if (options.fromDate) {
    query = query.where('date', '>=', options.fromDate);
  }

  if (options.toDate) {
    query = query.where('date', '<=', options.toDate);
  }

  return query;
}

module.exports = AppointmentRepository;
module.exports.COLLECTION_NAME = APPOINTMENT;
module.exports.supportedSearchParams = supportedSearchParams;
module.exports.appointmentRepositoryInstance = new AppointmentRepository(
  require('./firestore')
);
