'use strict';

class ProviderClient {
  constructor(client, tokenClient, host) {
    this.host = host;
    this.tokenClient = tokenClient;
    this.client = client;
  }

  async queryProvider(providerId) {
    const token = await this.tokenClient.getToken(this.host);

    return this.client.get({
      url: `${this.host}/admin/provider/${providerId}`,
      auth: {
        bearer: token
      },
      json: true
    });
  }
}

module.exports = ProviderClient;
module.exports.providerClientInstance = new ProviderClient(
  require('./http-client'),
  require('./token-client').tokenClientInstance,
  process.env.PROVIDER_SERVICE_HOST
);
