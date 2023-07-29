import type { ProxyistAdapter } from '@paradisec/proxyist-adapter-common';

declare global {
  namespace Express {
    export interface Request {
      locals: {
        adapter: ProxyistAdapter
      }
    }
  }
}
