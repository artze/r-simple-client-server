'use strict'

/*
*  Modify this file as needed.
*/

const net = require('net')
const port = 8080;
const host = '127.0.0.1';

process.on('SIGTERM', () => {
  process.exit(0)
})

const server = net.createServer();
server.listen(port, host)

server.on('connection', (sock) => {
  let body = [];
  sock.on('data', body.push.bind(body));
  sock.on('end', () => {
    console.log(Buffer.concat(body).toString())
  })
})