const request = require('supertest');
const { Pool } = require('pg');
const db = require('../server/db/index.js');

describe('All Products Route', () => {
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
  })

  afterEach(async () => { // Drop temporary tables
    await db.query('DROP TABLE IF EXISTS pg_temp.products');
  })

  afterAll(async () => {
    app.server.close();
    pool.end();
  })

  describe('GET /products', () => {
    test('should get a list of the first 5 products when user doesn\'nt supply either a page or count query parameter', async () => {
      const response = await request(app)
        .get('/products');
      const data = response._body;
      const result = [{
        id: 1,
        name: 'Joggertons',
        slogan: 'Wear Em!',
        description: 'I think they will fit you?',
        category: 'Joggers',
        default_price: '150'
      },
      {
        id: 2,
        name: 'Shirtsies',
        slogan: 'Wear Em!',
        description: 'I think they will fit you?',
        category: 'Shirts',
        default_price: '1000'
      },
      {
        id: 3,
        name: 'Jacketses',
        slogan: 'Wear Em!',
        description: 'I think they will fit you?',
        category: 'Jackets',
        default_price: '250'
      },
      {
        id: 4,
        name: 'Glovoes',
        slogan: 'Wear Em!',
        description: 'I think they will fit you?',
        category: 'Gloves',
        default_price: '20'
      },
      {
        id: 5,
        name: 'Hatters',
        slogan: 'Wear Em!',
        description: 'I think they will fit you?',
        category: 'Hats',
        default_price: '2'
      }]
      expect(data.length).toBe(5);
      expect(data).toEqual(result);
    })
  })
})
