const express = require('express');
const morgan = require('morgan');
const routes = require('./routes.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/', routes)

app.listen(port, () => {
  console.log(`Currently listening on port ${port}`);
})
