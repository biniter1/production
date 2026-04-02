const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  test('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Root endpoint', () => {
  test('GET / returns welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Hello');
  });
});

describe('Add endpoint', () => {
  test('POST /add returns sum of two numbers', async () => {
    const res = await request(app)
      .post('/add')
      .send({ a: 3, b: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(8);
  });

  test('POST /add returns 400 if inputs are not numbers', async () => {
    const res = await request(app)
      .post('/add')
      .send({ a: 'foo', b: 5 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /add handles negative numbers', async () => {
    const res = await request(app)
      .post('/add')
      .send({ a: -3, b: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(7);
  });
});
