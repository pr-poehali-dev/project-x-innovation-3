CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);