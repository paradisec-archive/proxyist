import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import S3rver from 's3rver'; // eslint-disable-line import/no-extraneous-dependencies

import { objectTests } from 'proxyist-adapter-tests/src/object.test';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proxyist-adapter-s3'));

const s3rver = new S3rver({
  configureBuckets: [{
    name: 'proxyist',
    configs: [],
  }],
  directory: tmpDir,
  silent: true,
});

beforeAll(async () => {
  await s3rver.run();
});

afterAll(() => {
  s3rver.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});


process.env.PROXYIST_ADAPTER_NAME = 'proxyist-adapter-s3';
process.env.PROXYIST_ADAPTER_CONFIG = (new URL('proxyist.config.js', import.meta.url)).toString().replace('file://', '');

const app = await import('proxyist');

objectTests(app.default);
