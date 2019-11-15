'use strict';

class TokenClient {
  constructor(client) {
    this.client = client;
  }

  async getToken(host) {
    if (process.env.NODE_ENV === 'development') {
      return process.env.ACCESS_TOKEN;
    }

    // Set up metadata server request
    // See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
    const metadataServerTokenURL =
      'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';

    const tokenRequestOptions = {
      uri: metadataServerTokenURL + host,
      headers: {
        'Metadata-Flavor': 'Google'
      }
    };

    return await this.client(tokenRequestOptions);
  }
}

module.exports = TokenClient;
module.exports.tokenClientInstance = new TokenClient(require('./http-client'));
