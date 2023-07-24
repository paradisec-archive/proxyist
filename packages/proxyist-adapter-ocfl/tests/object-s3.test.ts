import fs from 'node:fs';
import S3rver from 's3rver'; // eslint-disable-line import/no-extraneous-dependencies

import { objectTests } from '@paradisec/proxyist-adapter-tests/src/object.test'; // eslint-disable-line import/no-extraneous-dependencies

const s3rver = new S3rver({
  configureBuckets: [{
    name: 'proxyist',
    configs: [],
  }],
  directory: 'tests/data-s3',
  silent: true,
});

fs.rmSync('tests/data-s3', { recursive: true, force: true });
fs.mkdirSync('tests/data-s3');
await s3rver.run();

afterAll(() => {
  s3rver.close();
  fs.rmSync('data/tests-s3', { recursive: true, force: true });
});

const adapterName = '@paradisec/proxyist-adapter-ocfl';
const adapterConfigPath = (new URL('proxyist-s3.config.js', import.meta.url)).toString().replace('file://', '');

await objectTests(adapterName, adapterConfigPath);
