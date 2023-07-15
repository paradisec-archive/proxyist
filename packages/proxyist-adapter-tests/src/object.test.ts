import fs from 'node:fs';
import request from 'supertest';

import App from 'proxyist';

import type { ProxyistCreateAdapter, AdapterConfig } from 'proxyist-adapter-common';

export const objectTests = async (adapterName: string, adapterConfigPath: string) => {
  const { default: createAdapter } = await import(adapterName) as { default: ProxyistCreateAdapter<AdapterConfig> };

  if (!fs.existsSync(adapterConfigPath)) {
    throw new Error(`Adapter config file does not exist: ${adapterConfigPath}`);
  }
  const { default: adapterConfig } = await import(adapterConfigPath) as { default: AdapterConfig };

  const adapter = await createAdapter(adapterConfig);

  const app = App(adapter);

  describe('Local Adapter /object', () => {
    test('HEAD /NT1-001/no-file.json', async () => request(app)
      .head('/object/NT1-001/no-file.json')
      .expect(404));

    test('GET /NT1-001/no-file.json', async () => request(app)
      .get('/object/NT1-001/no-file.json')
      .expect(404));

    test('POST /NT1-001/foo.json', async () => request(app)
      .post('/object/NT1-001/foo.json')
      .set('Content-type', 'application/octet-stream')
      .send('{ "FOO": "BAR" }')
      .expect(201));

    test('HEAD /NT1-001/foo.json', async () => request(app)
      .head('/object/NT1-001/foo.json')
      .expect(200));

    test('HEAD /NT1-001/foo.json', async () => request(app)
      .head('/object/NT1-001/foo.json')
      .expect(200));

    test('GET /NT1-001/foo.json', async () => request(app)
      .get('/object/NT1-001/foo.json')
      .expect('Content-Type', /json/)
      .expect(200, '{ "FOO": "BAR" }'));

    test('POST /NT1-001/foo.json 2nd time', async () => request(app)
      .post('/object/NT1-001/foo.json')
      .set('Content-type', 'application/octet-stream')
      .send('{ "FOO": "BAR2" }')
      .expect(409));

    test('GET /NT1-001/foo.json', async () => request(app)
      .get('/object/NT1-001/foo.json')
      .expect('Content-Type', /json/)
      .expect(200, '{ "FOO": "BAR" }'));

    test('PUT /NT1-001/foo.json', async () => request(app)
      .put('/object/NT1-001/foo.json')
      .set('Content-type', 'application/octet-stream')
      .send('{ "FOO": "BAR2" }')
      .expect(201));

    test('GET /NT1-001/foo.json', async () => request(app)
      .get('/object/NT1-001/foo.json')
      .expect('Content-Type', /json/)
      .expect(200, '{ "FOO": "BAR2" }'));

    test('DELETE /NT1-001/foo.json', async () => request(app)
      .delete('/object/NT1-001/foo.json')
      .expect(204));

    test('GET /NT1-001/foo.json', async () => request(app)
      .get('/object/NT1-001/foo.json')
      .expect(404));
  });
};
