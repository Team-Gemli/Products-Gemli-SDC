const express = require('express');
const router = express.Router();
const controller = require('./controllers');

router.get('/', (req, res) => {
  console.log('test');
  res.send('hai');
})

/*
--- Products ---
*/
router.get('/products', controller.products.get);
router.get('/products/:id', controller.products.getOne);
router.get('/products/:product_id/styles', controller.products.getStyles);
router.get('/products/:product_id/related', controller.products.getRelated);

/*
--- Cart ---
*/

module.exports = router;