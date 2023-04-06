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
      .catch(err => {
        // console.log('unable to retrieve products, error:', err);
      })
  },
  getOne: (productId) => {
    return db.query("SELECT p.id, p.name, p.description, p.category, p.default_price, json_agg(json_build_object('feature', f.name, 'value', f.value)) AS features FROM products p INNER JOIN features f ON p.id = f.product_id WHERE p.id = $1 GROUP BY p.id", [productId])
      .then(res => {
        // console.log('response:', res.rows[0]);
        return res.rows[0];
      })
      .catch(err => {
        console.log('unable to retrieve product, error:', err)
      })
  },
  getStyles: () => {

  },
  getRelated: () => {

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