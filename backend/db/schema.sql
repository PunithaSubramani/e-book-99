-- BookVerse PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  gift_points   INTEGER DEFAULT 150,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Books
CREATE TABLE IF NOT EXISTS books (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  author      VARCHAR(255) NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  brand       VARCHAR(50),
  price       NUMERIC(10,2) NOT NULL,
  rating      NUMERIC(3,1) DEFAULT 0,
  reviews     INTEGER DEFAULT 0,
  image       TEXT,
  description TEXT,
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id    INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  qty        INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total           NUMERIC(10,2) NOT NULL,
  tax             NUMERIC(10,2) DEFAULT 0,
  points_discount NUMERIC(10,2) DEFAULT 0,
  payment_method  VARCHAR(50),
  status          VARCHAR(30) DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id    INTEGER NOT NULL REFERENCES books(id),
  qty        INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      VARCHAR(50),
  line1      VARCHAR(255) NOT NULL,
  city       VARCHAR(100) NOT NULL,
  state      VARCHAR(100),
  zip        VARCHAR(20),
  country    VARCHAR(100) DEFAULT 'USA',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_brand    ON books(brand);
CREATE INDEX IF NOT EXISTS idx_cart_user      ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user    ON orders(user_id);
