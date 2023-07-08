import request from 'supertest'; // eslint-disable-line import/no-extraneous-dependencies
import type { Express } from 'express';

export const objectTests = (app: Express) => {
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
