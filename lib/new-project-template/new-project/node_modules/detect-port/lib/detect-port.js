'use strict';

const debug = require('debug')('detect-port');
const net = require('net');

module.exports = (port, callback) => {
  if (typeof port === 'function') {
    callback = port;
    port = null;
  }
  if (typeof callback === 'function') {
    return tryListen(port, callback);
  }
  // promise
  return new Promise(resolve => {
    tryListen(port, (_, realPort) => {
      resolve(realPort);
    });
  });
};

function tryListen(port, callback) {
  port = parseInt(port) || 0;
  const server = new net.Server();

  server.on('error', err => {
    debug('listen %s error: %s', port, err);
    port = 0;
    server.close();
    return tryListen(port, callback);
  });

  server.listen({ port }, () => {
    port = server.address().port;
    server.close();
    debug('get free port: %s', port);
    callback(null, port);
  });
}
