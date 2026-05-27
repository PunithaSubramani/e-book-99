const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn(), connect: jest.fn() }));
const pool = require('../src/db');

// Helper: generate a valid JWT for tests
const makeToken = (id = 1) =>
  jwt.sign({ id, email: 'test@test.com' }, process.env.JWT_SECRET || 'bookverse_super_secret_jwt_key_2026', { expiresIn: '1h' });

describe('Cart API', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/cart', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(401);
    });

    it('returns cart items for authenticated user', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, qty: 2, book_id: 1, title: 'Atomic Habits', price: 14.99 }],
      });
      const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${makeToken()}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('POST /api/cart', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).post('/api/cart').send({ book_id: 1 });
      expect(res.status).toBe(401);
    });

    it('returns 400 when book_id is missing', async () => {
      const res = await request(app).post('/api/cart').set('Authorization', `Bearer ${makeToken()}`).send({});
      expect(res.status).toBe(400);
    });

    it('adds new item to cart', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // no existing item
        .mockResolvedValueOnce({ rows: [{ id: 1, user_id: 1, book_id: 1, qty: 1 }] }); // insert
      const res = await request(app).post('/api/cart').set('Authorization', `Bearer ${makeToken()}`).send({ book_id: 1, qty: 1 });
      expect(res.status).toBe(201);
      expect(res.body.book_id).toBe(1);
    });

    it('increments qty when item already in cart', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ id: 5, qty: 1 }] }) // existing item
        .mockResolvedValueOnce({ rows: [{ id: 5, user_id: 1, book_id: 1, qty: 2 }] }); // update
      const res = await request(app).post('/api/cart').set('Authorization', `Bearer ${makeToken()}`).send({ book_id: 1, qty: 1 });
      expect(res.status).toBe(200);
      expect(res.body.qty).toBe(2);
    });
  });

  describe('DELETE /api/cart/:id', () => {
    it('removes item from cart', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const res = await request(app).delete('/api/cart/1').set('Authorization', `Bearer ${makeToken()}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/removed/i);
    });

    it('returns 404 when item not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).delete('/api/cart/999').set('Authorization', `Bearer ${makeToken()}`);
      expect(res.status).toBe(404);
    });
  });
});
