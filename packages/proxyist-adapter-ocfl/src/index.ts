import { OcflObjectConfig } from '@ocfl/ocfl';
import ocflFs from '@ocfl/ocfl-fs';
import ocflS3 from '@ocfl/ocfl-s3';

import type { ProxyistCreateAdapter, AdapterConfig } from '@paradisec/proxyist-adapter-common';
import { PassThrough } from 'stream';

// TODO we should add types to OCFL
type OcflStoreConfig = object;

interface LocalAdapterConfig extends AdapterConfig {
  type: 'fs' | 's3';
  ocflConfig: OcflObjectConfig;
  storageConfig: OcflStoreConfig;
  transformIdentifier: (identifier: string) => string;
  transformPath: (path: string) => string;
}

const createAdapter: ProxyistCreateAdapter<LocalAdapterConfig> = async (config) => {
  const repository = config.type === 'fs'
    ? ocflFs.storage(config.ocflConfig, config.storageConfig)
    : (ocflS3 as any).storage(config.ocflConfig, config.storageConfig);

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
    const result = new PassThrough();

    const promise = object.update(async (transaction: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      await transaction.write(path, result);
    });

    return { result, promise };
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

export default createAdapter;
