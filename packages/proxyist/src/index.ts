import http from 'node:http';
import Debug from 'debug';

import { loadAdapter } from './load-adapter.js';
import App from './app.js';

const adapterName = process.env.PROXYIST_ADAPTER_NAME;
if (!adapterName) {
  throw new Error('PROXYIST_ADAPTER_NAME is not set');
}

const adapterConfigPath = process.env.PROXYIST_ADAPTER_CONFIG;
if (!adapterConfigPath) {
  throw new Error('PROXYIST_ADAPTER_CONFIG is not set');
}

const adapter = await loadAdapter(adapterName, adapterConfigPath);
const app = App(adapter);

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
