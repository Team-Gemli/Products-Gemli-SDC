const request = require('supertest');
const { Pool } = require('pg');
const db = require('../server/db/index.js');

describe('Related Products', () => {
  let app;
  let pool;

  beforeAll(async () => { // Mock db connection and load app
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: 'products',
      max: 1,
      idleTimeoutMillis: 0
    })

    db.query = (text, values) => {
      return pool.query(text, values);
    }

    app = require('../server/index.js');
  })

  beforeEach(async () => { // Create temporary table
    await db.query('CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL)');
    await db.query('CREATE TEMPORARY TABLE related_products (LIKE related_products INCLUDING ALL)');
  })

  beforeEach(async () => { // Insert test data
    await db.query(`INSERT INTO pg_temp.products (id, name, slogan, description, category, default_price)
    VALUES
      (1, 'Joggertons', 'Wear Em!', 'I think they will fit you?', 'Joggers', '150'),
      (2, 'Shirtsies', 'Wear Em!', 'I think they will fit you?', 'Shirts', '1000'),
      (3, 'Jacketses', 'Wear Em!', 'I think they will fit you?', 'Jackets', '250'),
      (4, 'Glovoes', 'Wear Em!', 'I think they will fit you?', 'Gloves', '20'),
      (5, 'Hatters', 'Wear Em!', 'I think they will fit you?', 'Hats', '2'),
      (6, 'Jeanons', 'Wear Em!', 'I think they will fit you?', 'Jeans', '25')`);
    await db.query(`INSERT INTO pg_temp.related_products (id, current_product_id, related_product_id)
    VALUES
      (1, 1, 2),
      (2, 1, 3),
      (3, 1, 4)`);
  })
  afterEach(async () => { // Drop temporary tables
    await db.query('DROP TABLE IF EXISTS pg_temp.products');
    await db.query('DROP TABLE IF EXISTS pg_temp.related_products');
  })

  afterAll(async () => {
    app.server.close();
    pool.end();
  })

  describe('GET /products/:product_id/related', () => {
    test('should get a product\'s related product ids', async () => {
      const response = await request(app)
        .get('/products/1/related');
      const data = response.body;
      console.log('response:', response.body)
      const result = [ 2, 3, 4 ];
      expect(data).toEqual(result);
    })
  })
})
