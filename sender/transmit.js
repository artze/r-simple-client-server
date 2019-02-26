'use strict'

const net = require('net');
const client = new net.Socket();
const port = 8080;
const host = '127.0.0.1';

/*
*  This function will be called for each event.  (eg: for each sensor reading)
*  Modify it as needed.
*/
module.exports = (eventMsg, encoding, callback) => {
  client.connect(port, host, () => {
    client.write(JSON.stringify(eventMsg), (err) => {
      client.destroy()
      callback(err)
    })
  })
}
