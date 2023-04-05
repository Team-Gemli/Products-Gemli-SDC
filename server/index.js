const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/', routes)

app.get('/', (req, res) => {
  res.send('hello world!');
})

app.listen(port, () => {
  console.log(`Currently listening on port ${port}`);
})
