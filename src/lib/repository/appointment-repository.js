'use strict';

const { isEmpty } = require('lodash');

const APPOINTMENT = 'appointments';

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
    const document = await this.firestore.collection(APPOINTMENT).add({
      ...appointment,
      state: 'BOOKED'
    });

    return document.id;
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
}

module.exports = AppointmentRepository;
module.exports.COLLECTION_NAME = APPOINTMENT;
module.exports.appointmentRepositoryInstance = new AppointmentRepository(
  require('./firestore')
);
