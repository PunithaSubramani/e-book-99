const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — place order
router.post('/', auth, async (req, res) => {
  const { items, address_id, payment_method, redeem_points = false } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'No items provided' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      const book = await client.query('SELECT price FROM books WHERE id = $1', [item.book_id]);
      if (book.rows.length === 0) throw new Error(`Book ${item.book_id} not found`);
      subtotal += book.rows[0].price * item.qty;
    }
    const tax = subtotal * 0.08;

    // Gift points discount
    let pointsDiscount = 0;
    if (redeem_points) {
      const userResult = await client.query('SELECT gift_points FROM users WHERE id = $1', [req.user.id]);
      const pts = userResult.rows[0].gift_points;
      pointsDiscount = Math.min(pts * 0.01, subtotal * 0.1);
      const ptsUsed = Math.min(pts, Math.round(subtotal * 10));
      await client.query('UPDATE users SET gift_points = gift_points - $1 WHERE id = $2', [ptsUsed, req.user.id]);
    }

    const total = subtotal + tax - pointsDiscount;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, tax, points_discount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, 'completed') RETURNING *`,
      [req.user.id, total, tax, pointsDiscount, payment_method]
    );
    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      const book = await client.query('SELECT price FROM books WHERE id = $1', [item.book_id]);
      await client.query(
        'INSERT INTO order_items (order_id, book_id, qty, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.book_id, item.qty, book.rows[0].price]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  } finally {
    client.release();
  }
});

// GET /api/orders — user's order history
router.get('/', auth, async (req, res) => {
  try {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    const result = [];
    for (const order of orders.rows) {
      const items = await pool.query(
        `SELECT oi.*, b.title, b.author, b.image FROM order_items oi
         JOIN books b ON b.id = oi.book_id WHERE oi.order_id = $1`,
        [order.id]
      );
      result.push({ ...order, items: items.rows });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const items = await pool.query(
      `SELECT oi.*, b.title, b.author, b.image FROM order_items oi
       JOIN books b ON b.id = oi.book_id WHERE oi.order_id = $1`,
      [order.rows[0].id]
    );
    res.json({ ...order.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
