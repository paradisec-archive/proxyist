import request from 'supertest';

import app from '../src/app.js';

describe('Test example', () => {
  test('GET /', async () => {
    request(app)
      .get('/object')
      .expect('Content-Type', /json/)
      .expect(200)
  });
});
