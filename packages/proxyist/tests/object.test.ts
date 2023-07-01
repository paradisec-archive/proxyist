import request from 'supertest';

import app from '../src/app.js';

describe('Local Adapter /object', () => {
  test('PUT /1/foo.json', async () => request(app)
    .post('/object/1/foo.json')
    .send({ me: 'foo.json' })
    .expect(201)
  );

  test('GET /1/foo.json', async () => request(app)
    .get('/object/1/foo.json')
    .send({ me: 'foo.json' })
    .expect('Content-Type', /json/)
    .expect(200, { me: 'foo.json' })
  );
});
