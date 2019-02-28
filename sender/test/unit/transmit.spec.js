/**
 * Test package for transmit.js module
 * IMPORTANT NOTE: this test package assumes that transmit.js module makes TCP transmission at 2-second intervals
 */
const sinon = require('sinon');
const transmit = require('../../transmit');
const transmissionData = require('../fixtures/transmissionData');

describe('Test transmit module', () => {
  it('Should call TCP connection method', () => {
    const connect = sinon.stub(transmit.testHelpers.client, 'connect');
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

    clock.tick(2000 * transmissionData.length);
    connect.restore();
    clock.restore();

    sinon.assert.callCount(connect, Math.ceil(transmissionData.length / 2));
  })

  it('Should call client write method with correct message', () => {
    const connect = sinon.stub(transmit.testHelpers.client, 'connect');
    const write = sinon.stub(transmit.testHelpers.client, 'write');
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
    
    clock.tick(2000 * transmissionData.length);
    connect.yield();
    connect.restore();
    write.restore();
    clock.restore();

    sinon.assert.callCount(write, Math.ceil(transmissionData.length / 2));
    sinon.assert.calledWith(write.firstCall, transmit.testHelpers.generateMsgString(transmissionData.slice(0, 2)))
    sinon.assert.calledWith(write.lastCall, transmit.testHelpers.generateMsgString(transmissionData.slice(-1)))
  })

  it('Should call destroy TCP client method correctly', () => {
    const connect = sinon.stub(transmit.testHelpers.client, 'connect');
    const write = sinon.stub(transmit.testHelpers.client, 'write');
    const destroy = sinon.stub(transmit.testHelpers.client, 'destroy');
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
    
    clock.tick(2000 * transmissionData.length);
    connect.yield();
    write.yield();
    connect.restore();
    write.restore();
    destroy.restore();
    clock.restore();

    sinon.assert.callCount(destroy, Math.ceil(transmissionData.length / 2));
  })
})