import ocfl from '@johnf/ocfl-fs';

import type { CreateAdapter, AdapterConfig } from 'proxyist-adapter-common';
import { PassThrough } from 'stream';

// TODO we should add types to OCFL
type OcflFsStoreConfig = {
  root: string,
}

interface LocalAdapterConfig extends AdapterConfig {
  storageConfig: OcflFsStoreConfig;
  transformIdentifier: (identifier: string) => string;
  transformPath: (path: string) => string;
}

export const createAdapter: CreateAdapter<LocalAdapterConfig> = async (config) => {
  const repository = await ocfl.storage(config.storageConfig);

  // TODO is this needed???
  await repository.create();

  const getObject = (identifier: string) => {
    const newIdentifier = config.transformIdentifier(identifier);

    return repository.object(newIdentifier);
  };

  const getPath = (path: string) => config.transformPath(path);

  const exists = async (identifier: string, filename: string) => {
    const object = getObject(identifier);
    const path = getPath(filename);

    if (!object.exists(path)) {
      return false;
    }

    const inventory = await object.getInventory();

    if (!inventory) {
      return false;
    }

    return [...inventory.files()].map((a: { logicalPath: string }) => a.logicalPath).includes(path);
  };

  const read = async (identifier: string, filename: string) => {
    const object = getObject(identifier);
    const path = getPath(filename);

    return object.getFile(path).asStream();
  };

  const write = async (identifier: string, filename: string) => {
    const object = getObject(identifier);
    const path = getPath(filename);
    const ws = new PassThrough();

    const promise = object.update(async (transaction: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      await transaction.write(path, ws);
    });

    return { ws, promise };
  };

  const rm = async (identifier: string, filename: string) => {
    const object = getObject(identifier);
    const path = getPath(filename);

    const promise = object.update(async (transaction: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      await transaction.remove(path);
    });

    return promise;
  };

  return {
    exists,
    read,
    write,
    rm,
  };
};
