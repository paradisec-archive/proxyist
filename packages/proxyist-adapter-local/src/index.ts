import fs from 'node:fs';

import type { AdapterConfig, ProxyistCreateAdapter } from '@paradisec/proxyist-adapter-common';

interface LocalAdapterConfig extends AdapterConfig {
  directory: string;
  transform: (identifier: string) => string;
}

const createAdapter: ProxyistCreateAdapter<LocalAdapterConfig> = async (config) => {
  const getPath = (identifier: string, filename: string) => {
    const path = config.transform(identifier);

    return `${config.directory}/${path}/${filename}`;
  };

  const exists = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    return fs.existsSync(path);
  };

  const read = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    return fs.createReadStream(path);
  };

  const write = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    const directory = path.replace(/\/[^/]+$/, '');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const result = fs.createWriteStream(path);
    return { result, promise: Promise.resolve(true) };
  };

  const rm = async (identifier: string, filename: string) => {
    const path = getPath(identifier, filename);

    return fs.rmSync(path);
  };

  return {
    exists,
    read,
    write,
    rm,
  };
};

export default createAdapter;
