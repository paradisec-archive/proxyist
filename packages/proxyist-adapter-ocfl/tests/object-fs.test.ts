import fs from 'node:fs';

import { objectTests } from '@paradisec/proxyist-adapter-tests/src/object.test'; // eslint-disable-line import/no-extraneous-dependencies

afterAll(() => {
  fs.rmSync('tests/data-fs', { recursive: true, force: true });
});

fs.rmSync('tests/data-fs', { recursive: true, force: true });
fs.mkdirSync('tests/data-fs');

const adapterName = '@paradisec/proxyist-adapter-ocfl';
const adapterConfigPath = (new URL('proxyist-fs.config.js', import.meta.url)).toString().replace('file://', '');

await objectTests(adapterName, adapterConfigPath);
