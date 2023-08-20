import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import S3rver from 's3rver'; // eslint-disable-line import/no-extraneous-dependencies

import { objectTests, objectRedirectTests } from '@paradisec/proxyist-adapter-tests'; // eslint-disable-line import/no-extraneous-dependencies

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
const adapterConfigPathBody = (new URL('proxyist.config-body.js', import.meta.url)).toString().replace('file://', '');
const adapterConfigPathRedirect = (new URL('proxyist.config-redirect.js', import.meta.url)).toString().replace('file://', '');

await objectTests(adapterName, adapterConfigPathBody);
await objectRedirectTests(adapterName, adapterConfigPathRedirect);
