'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const errorHandlingMW = require('../../../src/lib/mw/error-handling-mw');
const ServiceError = require('../../../src/lib/util/service-error');

describe('error-handling-mw unit tests', () => {
  it('should respond with the error information', () => {
    const json = stub();
    const res = {
      status: stub().returns({ json: json })
    };

    const error = {
      errorCode: 'TESTerrorCode',
      statusCode: 'TESTstatusCode',
      message: 'TESTmessage'
    };

    errorHandlingMW(new ServiceError(error), {}, res, undefined);

    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(error.statusCode)).to.be.true;
    expect(json.called).to.be.true;
    expect(
      json.calledWith({
        errorCode: error.errorCode,
        message: error.message
      })
    ).to.be.true;
  });
});
