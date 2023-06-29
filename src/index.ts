import http from 'node:http';
import Debug from 'debug';

import app from './app.js';

const debug = Debug('proxyist:server');

const port = process.env['PORT'] || '3000'; // eslint-disable-line dot-notation

const server = http.createServer(app);

const onError = (error: NodeJS.ErrnoException) => { // eslint-disable-line no-undef
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE': // eslint-disable-line no-fallthrough
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    default: // eslint-disable-line no-fallthrough
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;

  debug(`Listening on ${bind}`);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
