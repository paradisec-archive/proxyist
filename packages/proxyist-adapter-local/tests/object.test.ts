import fs from 'node:fs';

import { objectTests } from 'proxyist-adapter-tests/src/object.test'; // eslint-disable-line import/no-extraneous-dependencies

const tmpDir = new URL('data', import.meta.url);

process.env.PROXYIST_ADAPTER_NAME = 'proxyist-adapter-local';
process.env.PROXYIST_ADAPTER_CONFIG = (new URL('proxyist.config.js', import.meta.url)).toString().replace('file://', '');

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const app = await import('proxyist');

objectTests(app.default);
