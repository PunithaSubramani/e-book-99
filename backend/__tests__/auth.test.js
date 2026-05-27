const request = require('supertest');
const app = require('../src/app');

// Mock the DB pool so tests don't need a real PostgreSQL connection
jest.mock('../src/db', () => {
  const mockQuery = jest.fn();
  return { query: mockQuery, connect: jest.fn() };
});

const pool = require('../src/db');

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Test', email: 'not-an-email', password: 'pass123' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for short password', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Test', email: 'test@test.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // existing user check
    const res = await request(app).post('/api/auth/register').send({ name: 'Test', email: 'existing@test.com', password: 'password123' });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('returns 201 and token on success', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // no existing user
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test', email: 'new@test.com', gift_points: 150 }] }); // insert
    const res = await request(app).post('/api/auth/register').send({ name: 'Test', email: 'new@test.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('new@test.com');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('returns 401 when user not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'pass123' });
    expect(res.status).toBe(401);
  });
});
