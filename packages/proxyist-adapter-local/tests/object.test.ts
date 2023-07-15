import fs from 'node:fs';

import { objectTests } from 'proxyist-adapter-tests/src/object.test'; // eslint-disable-line import/no-extraneous-dependencies

const tmpDir = new URL('data', import.meta.url);

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const adapterName = 'proxyist-adapter-local';
const adapterConfigPath = (new URL('proxyist.config.js', import.meta.url)).toString().replace('file://', '');

await objectTests(adapterName, adapterConfigPath);
