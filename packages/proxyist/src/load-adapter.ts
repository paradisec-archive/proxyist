import fs from 'node:fs';

import type { ProxyistCreateAdapter, AdapterConfig } from '@paradisec/proxyist-adapter-common';

export const loadAdapter = async (adapterName: string, adapterConfigPath: string) => {
  const { default: createAdapter } = await import(adapterName) as { default: ProxyistCreateAdapter<AdapterConfig> };

  if (!fs.existsSync(adapterConfigPath)) {
    throw new Error(`Adapter config file does not exist: ${adapterConfigPath}`);
  }
  const { default: adapterConfig } = await import(adapterConfigPath) as { default: AdapterConfig };

  const adapter = await createAdapter(adapterConfig);

  return adapter;
};
