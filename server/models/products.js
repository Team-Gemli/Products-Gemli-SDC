const db = require('../db/index.js');

module.exports = {
  getAll: (page, count) => {
    const offset = (page - 1) * count;
    const values = [count, offset]

    return db.query('SELECT * FROM products LIMIT $1 OFFSET $2', values)
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
    return db.query(`SELECT s.id AS style_id, s.name, s.original_price, NULLIF(s.sale_price, 'null') AS sale_price, s.default_style AS "default?", json_agg(json_build_object('thumbnail_url', p.thumbnail_url, 'url', p.url)) AS photos, json_object_agg(sk.id, json_build_object('quantity', sk.quantity, 'size', sk.size)) AS skus
    FROM styles s
      INNER JOIN photos p ON s.id = p.style_id
      INNER JOIN skus sk ON s.id = sk.style_id
      WHERE s.product_id = $1 GROUP BY s.id`, [productId])
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