'use strict';

const supportedTypes = ['time', 'date'];
const APPOINTMENT = 'config';

class ConfigRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Query for all the contents within the config
   * collection associated with the provided document
   *
   * @param {String} type
   * @returns {*}
   * @memberof ConfigRepository
   */
  async query(docId) {
    const snapshot = await this.firestore
      .collection(APPOINTMENT)
      .doc(docId)
      .get();

    if (snapshot && snapshot.exists) {
      return snapshot.data();
    }

    return {};
  }
}

module.exports = ConfigRepository;
module.exports.supportedTypes = supportedTypes;
module.exports.configRepositoryInstance = new ConfigRepository(
  require('./firestore')
);
