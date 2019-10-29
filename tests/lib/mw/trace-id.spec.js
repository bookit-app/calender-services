'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const extractTraceIdFromHeader = require('../../../src/lib/mw/trace-id-mw');

describe('trace-id-mw unit-tests', () => {
  it('should return the trace id when provided', () => {
    const req = {
      header: stub().returns('8b35b3bd2c62f98bfce0796516b8fa45;o=1')
    };

    const next = stub();
    extractTraceIdFromHeader(req, {}, next);
    expect(req.traceContext).to.equal('8b35b3bd2c62f98bfce0796516b8fa45;o=1');
  });

  it('should return the nothing when trace id is not provided provided', () => {
    const req = {
      header: stub().returns()
    };
    const next = stub();
    extractTraceIdFromHeader(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });
});
