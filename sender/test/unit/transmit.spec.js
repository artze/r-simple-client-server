const expect = require('chai').expect;
const sinon = require('sinon');
const transmit = require('../../transmit');
const transmissionData = require('../fixtures/transmissionData');

describe('Test transmit module', () => {
  it('TCP connection function should be called', () => {
    const connect = sinon.stub(transmit.client, 'connect');
    const clock = sinon.useFakeTimers();
    const eventInterval = 1000;

    let index = 0
    const transmitAtInterval = () => {
      setTimeout(() => {
        transmit(transmissionData[index], null, () => {});
        index++;
        if(index < transmissionData.length) {
          transmitAtInterval();
        }
      }, eventInterval);
    }
    transmitAtInterval();

    clock.tick(200000);
    sinon.assert.callCount(connect, Math.ceil(transmissionData.length / 2));
    connect.restore();
    clock.restore();
  })
})