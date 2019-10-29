'use strict';

const { isEmpty, omit } = require('lodash');

const APPOINTMENT = 'appointments';

class appointmentRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  createAppointment(appointment) {
    const data = omit(appointment, ['uid', 'aid']);

    data.time = isEmpty(data.time) ? 'O' : data.time;
    data.date = isEmpty(data.date) ? '' : data.date;
    data.uid = isEmpty(data.uid) ? '': data.uid;
    data.aid = isEmpty(data.aid) ? '': data.aid;

    return data;
  }
  
  async create(appointment) {
    await this.firestore
      .collection(APPOINTMENT)
      .doc(appointment.aid)
      .create(this.createAppointment(appointment));

    return appointment.aid;
  }

  /**
   * Trigger the delete into Firestore for the document at
   * path profile/{profileId}
   *
   * @param {String} appoinmentId
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

    /**
   * Query for a appointment based on the AID code
   *
   * @param {String} aid
   * @returns {appointment | {}}
   * @memberof appointmentRepository
   */
  async findAppointmentByAid(aid) {
    const snapshot = await this.firestore
      .collection(APPOINTMENT)
      .where('aid', '==', aid)
      .get();

    if (snapshot && !snapshot.empty) {
      // As we enforce a single EIN return the first
      return snapshot.docs[0].data();
    }

    return {};
  }



  async findByAppointmentId(appointmentId, options) {
    const documentReference = await this.firestore
      .collection(APPOINTMENT)
      .doc(appointmentId)
      .get();

    if (!isEmpty(documentReference) && documentReference.exists) {
      const appointment = documentReference.data();

      if (!isEmpty(options)) {
        const data = {};
        data[options.select] = appointment[options.select];
        return data;
      }

      return appointment;
    }

    return undefined;
  }

  async update(appointment) {
    await this.firestore
      .collection(APPOINTMENT)
      .doc(appointment.aid)
      .set(omit(appointment, ['aid']), { merge: true });

    return;
  }
}

module.exports = appointmentRepository;

module.exports.appointmentRepositoryInstance = new appointmentRepository(
  require('./firestore')
);

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

  if (options.businessName) {
    query = query.where('businessName', '==', options.businessName);
  }

  if (options.time) {
    query = query.where('time', '==', time);
  }
  if (options.date) {
    query = query.where('date', '==', date);
  }

  if (options.aid) {
    query = query.where('aid', '==', aid);
  }

  if (options.uid) {
    query = query.where('uid', 'array-contains', uid);
  }

  return query;
}

module.exports = AppointmentRepository;
module.exports.COLLECTION_NAME = APPOINTMENT;
module.exports.supportedSearchParams = supportedSearchParams;
module.exports.appointmentRepositoryInstance = new appointmentRepository(
  require('./firestore')
);
