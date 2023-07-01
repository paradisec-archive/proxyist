import type { CreateAdapter, AdapterConfig } from 'proxyist-adapter-common';

interface LocalAdapterConfig extends AdapterConfig {
  directory: string;
}

export const createAdapter: CreateAdapter<LocalAdapterConfig> = (config) => {
  console.debug('createAdapter', config);

  const get = async (identifier: string, filename: string) => {
    console.debug('get', identifier, filename);
  };

  return {
    get,
  };
};
