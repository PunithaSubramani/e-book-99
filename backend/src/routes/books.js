const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/books — list with optional filters
router.get('/', async (req, res) => {
  const { category, brand, tag, q, sort = 'popular', limit = 50, offset = 0 } = req.query;
  try {
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    let idx = 1;

    if (category) { query += ` AND category = $${idx++}`; params.push(category); }
    if (brand)    { query += ` AND brand = $${idx++}`;    params.push(brand); }
    if (tag)      { query += ` AND $${idx++} = ANY(tags)`; params.push(tag); }
    if (q)        { query += ` AND (title ILIKE $${idx} OR author ILIKE $${idx++})`; params.push(`%${q}%`); }

    const orderMap = {
      popular:    'reviews DESC',
      'price-asc':  'price ASC',
      'price-desc': 'price DESC',
      rating:     'rating DESC',
    };
    query += ` ORDER BY ${orderMap[sort] || 'reviews DESC'}`;
    query += ` LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    res.json({ books: result.rows, total: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/books/:id/related
router.get('/:id/related', async (req, res) => {
  try {
    const book = await pool.query('SELECT category FROM books WHERE id = $1', [req.params.id]);
    if (book.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    const related = await pool.query(
      'SELECT * FROM books WHERE category = $1 AND id != $2 ORDER BY rating DESC LIMIT 4',
      [book.rows[0].category, req.params.id]
    );
    res.json(related.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
