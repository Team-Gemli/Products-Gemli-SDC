const express = require('express');
const router = express.Router();
const controller = require('./controllers');
require('dotenv').config();

router.get('/', (req, res) => {
  console.log('test');
  res.send('hai');
})

/*
--- LoaderIO ---
*/

router.get(`/${process.env.LOADERIO_KEY}.txt`, (req, res) => {
  res.send(process.env.LOADERIO_KEY);
});

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