'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const extractUserInfoFromHeader = require('../../../src/lib/mw/user-mw');
const { errors } = require('../../../src/lib/constants');

describe('user-mw unit-tests', () => {
  it('should insert the user info into req.apiUserInfo when provided', () => {
    const req = {
      header: stub().returns(
        'ICAgIHsKICAgICAgImlzc3VlciI6ICJUT0tFTl9JU1NVRVIiLAogICAgICAiaWQiOiAiVVNFUl9JRCIsCiAgICAgICJlbWFpbCIgOiAiVVNFUl9FTUFJTCIKICAgIH0='
      )
    };

    const next = stub();
    extractUserInfoFromHeader(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;

    expect(req.apiUserInfo.issuer).to.equal('TOKEN_ISSUER');
    expect(req.apiUserInfo.id).to.equal('USER_ID');
    expect(req.apiUserInfo.date).to.equal('DATE');
    expect(req.apiUserInfo.time).to.equal('TIME');
    
  });

  it('should call next with an error if no user info is found', () => {
    const req = {
      header: stub().returns()
    };
    const next = stub();
    const res = {
      status: stub()
    };
    extractUserInfoFromHeader(req, res, next);
    expect(next.called).to.be.true;
    expect(next.args.length).to.equal(1);

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.unauthorized.errorCode);
    expect(statusCode).to.equal(errors.unauthorized.statusCode);
  });
});
