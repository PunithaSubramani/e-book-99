const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/cart — get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.qty, b.id as book_id, b.title, b.author, b.price, b.image
       FROM cart_items ci
       JOIN books b ON b.id = ci.book_id
       WHERE ci.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cart — add item
router.post('/', auth, async (req, res) => {
  const { book_id, qty = 1 } = req.body;
  if (!book_id) return res.status(400).json({ error: 'book_id required' });
  try {
    const existing = await pool.query(
      'SELECT id, qty FROM cart_items WHERE user_id = $1 AND book_id = $2',
      [req.user.id, book_id]
    );
    if (existing.rows.length > 0) {
      const updated = await pool.query(
        'UPDATE cart_items SET qty = qty + $1 WHERE id = $2 RETURNING *',
        [qty, existing.rows[0].id]
      );
      return res.json(updated.rows[0]);
    }
    const result = await pool.query(
      'INSERT INTO cart_items (user_id, book_id, qty) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, book_id, qty]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/cart/:id — update qty
router.patch('/:id', auth, async (req, res) => {
  const { qty } = req.body;
  if (!qty || qty < 1) return res.status(400).json({ error: 'qty must be >= 1' });
  try {
    const result = await pool.query(
      'UPDATE cart_items SET qty = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [qty, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cart/:id — remove item
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/cart — clear cart
router.delete('/', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
