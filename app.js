'use strict';

require('dotenv').config();

const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files in production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(routes);
app.use(errorHandler);

module.exports = app;
