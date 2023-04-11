const Models = require('../models');

module.exports = {
  get: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    Models.products.getAll(page, count)
      .then(data => {
        // console.log('response:', data);
        res.send(data);
      })
      .catch(err => {
        // console.log('unable to retrieve products from database, error:', err);
        res.status(400).end();
      })
  },
  getOne: (req, res) => {
    Models.products.getOne(req.params.id)
      .then(data => {
        // console.log('response:', data);
        res.send(data);
      })
      .catch(err => {
        // console.log('unable to retrieve the product from the database', err);
        res.status(400).end();
      })
  },
  getStyles: (req, res) => {
    Models.products.getStyles(req.params.product_id)
      .then(data => {
        res.send({
          product_id: req.params.product_id,
          results: data
        });
      })
      .catch(err => {
        // console.log('unable to retrieve product styles from database', err);
        res.status(400).end();
      })
  },
  getRelated: (req, res) => {
    Models.products.getRelated(req.params.product_id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        // console.log('unable to retrieve related products from database', err);
        res.status(400).end();
      })
  }
}