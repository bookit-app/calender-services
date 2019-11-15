'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const ProviderClient = require('../../../../src/services/create-appointment/src/client/provider-client');

const provider = {
  sample: 'DATA'
};

describe('provider-client unit tests', () => {
  let client, httpStub, tokenStub;

  before(() => {
    httpStub = {
      get: stub().resolves(provider)
    };

    tokenStub = {
      getToken: stub().resolves('TEST-TOKEN')
    };

    client = new ProviderClient(httpStub, tokenStub, 'http://localhost:8080');
  });

  it('should make an HTTP GET request', () => {
    expect(client.queryProvider('TEST-PROVIDER-ID')).to.be.fulfilled.then(
      response => {
        expect(response).to.deep.equal(provider);
        expect(tokenStub.getToken.called).to.be.true;
        expect(httpStub.get.called).to.be.true;
        expect(
          httpStub.get.calledWith({
            url: 'http://localhost:8080/admin/provider/TEST-PROVIDER-ID',
            auth: {
              bearer: 'TEST-TOKEN'
            },
            json: true
          })
        ).to.be.true;
      }
    );
  });
});
