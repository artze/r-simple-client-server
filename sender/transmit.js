'use strict'

const net = require('net');
const async = require('async');
const client = new net.Socket();
const port = 8080;
const host = '127.0.0.1';

let msgStore = [];
let hasPendingTransmission = false;

const generateMsgString = (msgArr) => {
  let msgTempStore = msgArr.slice();
  msgTempStore = msgTempStore.map((data) => JSON.stringify(data))
  msgTempStore = msgTempStore.join('\n')
  msgStore = [];

  return msgTempStore
}

const transmitAtInterval = (interval) => {
  hasPendingTransmission = true;
  
  setTimeout(() => {
    hasPendingTransmission = false;
    let msgTempStore = generateMsgString(msgStore)

    const transmissionSequence = [
      // 1. Establish TCP connection
      (callback) => {
        client.connect(port, host, () => {
          callback(null)
        })
      },
      // 2. Transmit message
      (callback) => {
        client.write(msgTempStore, (err) => {
          callback(err)
        })
      },
      // 3. Close TCP connection
      (callback) => {
        client.destroy();
        callback(null);
      }
    ]
    
    async.series(transmissionSequence)
  }, interval);
}

/*
*  This function will be called for each event.  (eg: for each sensor reading)
*  Modify it as needed.
*/
module.exports = (eventMsg, encoding, callback) => {
  msgStore.push(eventMsg);
  if(!hasPendingTransmission) {
    transmitAtInterval(2000);
  }
  callback()
}

module.exports.testHelpers = {
  client,
  generateMsgString
}