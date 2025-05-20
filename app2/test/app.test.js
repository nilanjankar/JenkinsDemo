const request = require('supertest');
const app = require('../app/index');

describe('GET /', () => {
  it('responds with "Hello from app1!"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello from app1!');
  });
});
