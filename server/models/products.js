const db = require('../db/index.js');

module.exports = {
  getAll: (page = 1, count = 5) => {
    const first = (page - 1) * count + 1;
    const last = page * count;

    return db.query('SELECT id, name, slogan, description, category, default_price FROM products WHERE id BETWEEN $1 AND $2 ORDER BY id ASC', [first, last])
      .then(res => {
        // console.log('response:', res.rows);
        return res.rows;
      })
  },
  getOne: (productId) => {
    return db.query("SELECT p.id, p.name, p.description, p.category, p.default_price, json_agg(json_build_object('feature', f.name, 'value', f.value)) AS features FROM products p INNER JOIN features f ON p.id = f.product_id WHERE p.id = $1 GROUP BY p.id", [productId])
      .then(res => {
        // console.log('response:', res.rows[0]);
        return res.rows[0];
      })
  },
  getStyles: (productId) => {
    return db.query(`SELECT s.id AS style_id, s.name, s.original_price, NULLIF(s.sale_price, 'null') AS sale_price, s.default_style AS "default?",
      (SELECT json_agg(json_build_object('url', url, 'thumbnail_url', thumbnail_url))
      FROM photos p
      WHERE p.style_id = s.id) AS photos,
      json_object_agg(sk.id, json_build_object('quantity', sk.quantity, 'size', sk.size)) AS skus
    FROM styles s
      INNER JOIN skus sk ON s.id = sk.style_id
    WHERE s.product_id = $1
    GROUP BY s.id, s.name, s.original_price, s.sale_price, s.default_style;
    `, [productId])
      .then(res => {
        // console.log('response:', res.rows);
        return res.rows;
      })
  },
  getRelated: (productId) => {
    return db.query('SELECT json_agg(related_product_id) FROM related_products WHERE current_product_id = $1', [productId])
      .then(res => res.rows[0]['json_agg']);
  },
  getProductsCount: () => {
    return db.query('SELECT COUNT(*) FROM products')
      .then(res => {
        console.log('response:', res);
      })
      .catch(err => {
        console.log('unable to retrieve products, error:', err);
      })
  }
}