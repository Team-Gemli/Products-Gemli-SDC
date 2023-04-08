const request = require('supertest');
const { Pool } = require('pg');
const db = require('../server/db/index.js');

describe('Styles Route', () => {
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
    await db.query('CREATE TEMPORARY TABLE styles (LIKE styles INCLUDING ALL)');
    await db.query('CREATE TEMPORARY TABLE photos (LIKE photos INCLUDING ALL)');
    await db.query('CREATE TEMPORARY TABLE skus (LIKE skus INCLUDING ALL)');
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
    await db.query(`INSERT INTO pg_temp.styles (id, product_id, name, sale_price, original_price, default_style)
    VALUES
      (1, 1, 'Grayest Gray', 'null', '120', true),
      (2, 1, 'Bluest Blue', '100', '150', false)`);
    await db.query(`INSERT INTO pg_temp.photos (id, style_id, url, thumbnail_url)
    VALUES
      (1, 1, 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,', 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'),
      (2, 1, 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,', 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'),
      (3, 2, 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,', 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80'),
      (4, 2, 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,', 'https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80')`);
    await db.query(`INSERT INTO pg_temp.skus (id, style_id, size, quantity)
    VALUES
      (1, 1, 'S', 5),
      (2, 1, 'L', 12),
      (3, 2, 'S', 4),
      (4, 2, 'L', 7)`);
  })

  afterEach(async () => { // Drop temporary tables
    await db.query('DROP TABLE IF EXISTS pg_temp.products');
    await db.query('DROP TABLE IF EXISTS pg_temp.styles');
    await db.query('DROP TABLE IF EXISTS pg_temp.photos');
    await db.query('DROP TABLE IF EXISTS pg_temp.related_products');
  })

  afterAll(async () => {
    app.server.close();
    pool.end();
  })

  describe('GET /products/:id', () => {
    test('should get a product\'s styles and their respective photos and skus', async () => {
      const response = await request(app)
        .get('/products/1/styles');
      const data = response.body;
      console.log('response:', response.body)
      const result = {
        product_id: '1',
        results: [
          {
            style_id: 1,
            name: 'Grayest Gray',
            original_price: '120',
            sale_price: null,
            'default?': true,
            photos: [
              {
                "thumbnail_url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
                "url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,",
              },
              {
                "thumbnail_url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
                "url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,",
              }
            ],
            skus: {
              "1": {
                "quantity": 5,
                "size": "S",
              },
              "2": {
                "quantity": 12,
                "size": "L",
              }
            }
          },
          {
            style_id: 2,
            name: 'Bluest Blue',
            original_price: '150',
            sale_price: '100',
            'default?': false,
            photos: [
              {
                "thumbnail_url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
                "url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,",
              },
              {
                "thumbnail_url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
                "url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80,",
              }
            ],
            skus: {
              "3": {
                "quantity": 4,
                "size": "S",
              },
              "4": {
                "quantity": 7,
                "size": "L",
              }
            }
          }
        ]
      }
      expect(data).toEqual(result);
    })
  })
})
