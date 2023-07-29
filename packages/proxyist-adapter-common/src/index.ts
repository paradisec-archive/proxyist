/* eslint-disable no-unused-vars */

import { Readable, Writable } from 'stream';

export type AdapterConfig = object;

export type ProxyistAdapter = {
  exists: (identifier: string, filename: string) => Promise<boolean>;
  read: (identifier: string, filename: string) => Promise<Readable | string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  write: (identifier: string, filename: string) => Promise<{ result: Writable | string, promise: Promise<any>}>;
  rm: (identifier: string, filename: string) => Promise<void>;
};

export type ProxyistCreateAdapter<T extends AdapterConfig> = (config: T) => Promise<ProxyistAdapter>;

export class BadIdentifierError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadIdentifierError';
  }
}
