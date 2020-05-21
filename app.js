'use strict';

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files in production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

module.exports = app;