const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'products',
  max: 1000
});

module.exports = {
  query: (q, values) => {
    return pool.query(q, values);
  }
}