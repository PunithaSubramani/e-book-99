const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const bookRoutes  = require('./routes/books');
const cartRoutes  = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth',   authRoutes);
app.use('/api/books',  bookRoutes);
app.use('/api/cart',   cartRoutes);
app.use('/api/orders', orderRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
