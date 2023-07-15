import fs from 'node:fs';

import type { ProxyistCreateAdapter, AdapterConfig } from 'proxyist-adapter-common';

export const loadAdapter = async (adapterName: string, adapterConfigPath: string) => {
  const createAdapter = await import(adapterName) as ProxyistCreateAdapter<AdapterConfig>;

  if (!fs.existsSync(adapterConfigPath)) {
    throw new Error(`Adapter config file does not exist: ${adapterConfigPath}`);
  }
  const adapterConfig = await import(adapterConfigPath) as { default: AdapterConfig };

  const adapter = await createAdapter(adapterConfig.default);

  return adapter;
};
