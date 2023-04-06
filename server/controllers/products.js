const Models = require('../models');

module.exports = {
  get: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    Models.products.getAll(page, count)
      .then(data => {
        console.log('response:', data);
        res.send(data);
      })
      .catch(err => {
        console.log('unable to retrieve products from database, error:', err);
      })
  },
  getOne: (req, res) => {
    Models.products.getOne(req.params.id)
      .then(data => {
        console.log('response:', data);
        res.send(data);
      })
      .catch(err => {
        console.log('unable to retrieve the product from the database', err);
      })
  },
  getStyles: (req, res) => {

  },
  getRelated: (req, res) => {

  }
}