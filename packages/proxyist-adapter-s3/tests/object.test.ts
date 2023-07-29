import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import S3rver from 's3rver'; // eslint-disable-line import/no-extraneous-dependencies

import { objectTests } from '@paradisec/proxyist-adapter-tests/src/object.test'; // eslint-disable-line import/no-extraneous-dependencies

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proxyist-adapter-s3'));

const s3rver = new S3rver({
  configureBuckets: [{
    name: 'proxyist',
    configs: [],
  }],
  directory: tmpDir,
  silent: true,
  port: 4569,
});

beforeAll(async () => {
  await s3rver.run();
});

afterAll(() => {
  s3rver.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const adapterName = '@paradisec/proxyist-adapter-s3';
const adapterConfigPath = (new URL('proxyist.config.js', import.meta.url)).toString().replace('file://', '');

await objectTests(adapterName, adapterConfigPath);
