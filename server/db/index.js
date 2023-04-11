const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: 'products',
  max: 100
});

module.exports = {
  query: (q, values) => {
    return pool.query(q, values);
  }
}