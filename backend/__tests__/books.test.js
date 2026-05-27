const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn(), connect: jest.fn() }));
const pool = require('../src/db');

const mockBooks = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', category: 'self-help', price: 14.99, rating: 4.9, reviews: 5120 },
  { id: 2, title: 'Sapiens',       author: 'Yuval Noah Harari', category: 'history', price: 13.99, rating: 4.8, reviews: 4200 },
];

describe('GET /api/books', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns list of books', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockBooks, rowCount: 2 });
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  it('returns 200 with empty array when no books match', async () => {
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const res = await request(app).get('/api/books?category=nonexistent');
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(0);
  });
});

describe('GET /api/books/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a single book', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockBooks[0]] });
    const res = await request(app).get('/api/books/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Atomic Habits');
  });

  it('returns 404 when book not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/books/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('GET /api/books/:id/related', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns related books', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ category: 'self-help' }] })
      .mockResolvedValueOnce({ rows: [mockBooks[0]] });
    const res = await request(app).get('/api/books/1/related');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 404 when source book not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/books/9999/related');
    expect(res.status).toBe(404);
  });
});
