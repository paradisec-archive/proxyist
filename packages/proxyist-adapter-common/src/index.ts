/* eslint-disable no-unused-vars */

import { ReadStream, WriteStream } from 'fs';

export type AdapterConfig = object;

export type CreateAdapter<T extends AdapterConfig> = (config: T) => {
  exists: (identifier: string, filename: string) => Promise<boolean>;
  read: (identifier: string, filename: string) => Promise<ReadStream | string>;
  write: (identifier: string, filename: string) => Promise<WriteStream | string>;
  rm: (identifier: string, filename: string) => Promise<void>;
}

export type ProxyistAdapter<T extends AdapterConfig> = {
   createAdapter: CreateAdapter<T>;
};
