'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const TokenClient = require('../../../../src/services/create-appointment/src/client/token-client');

describe('provider-client unit tests', () => {
  let client, httpStub;

  before(() => {
    httpStub = stub().resolves('TEST-TOKEN');
    client = new TokenClient(httpStub);
  });

  afterEach(() => {
    httpStub.resetHistory();
  });

  it('should make an HTTP GET request', () => {
    expect(client.getToken('http://localhost')).to.be.fulfilled.then(
      response => {
        expect(response).to.equal('TEST-TOKEN');
        expect(httpStub.called).to.be.true;
        expect(
          httpStub.calledWith({
            uri:
              'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=http://localhost',
            headers: {
              'Metadata-Flavor': 'Google'
            }
          })
        ).to.be.true;
      }
    );
  });

  it('should return token from env when NODE_ENV=development', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.ACCESS_TOKEN = 'TEST-LOCAL-TOKEN';
    expect(client.getToken('http://localhost')).to.be.fulfilled.then(
      response => {
        expect(response).to.equal('TEST-LOCAL-TOKEN');
        expect(httpStub.called).to.be.false;
        process.env.NODE_ENV = oldEnv;
      }
    );
  });
});
