'use strict'

const net = require('net');
const async = require('async');
const client = new net.Socket();
const port = 8080;
const host = '127.0.0.1';


/*
*  This function will be called for each event.  (eg: for each sensor reading)
*  Modify it as needed.
*/
module.exports = (eventMsg, encoding, callback) => {
  const transmissionSequence = [
    // 1. Establish TCP connection
    (callback) => {
      client.connect(port, host, () => {
        callback(null)
      })
    },
    // 2. Transmit message
    (callback) => {
      client.write(JSON.stringify(eventMsg), (err) => {
        callback(err)
      })
    },
    // 3. Close TCP connection
    (callback) => {
      client.destroy();
      callback(null);
    }
  ]
  
  async.series(transmissionSequence, function(err) {
    callback(err)
  })
}
