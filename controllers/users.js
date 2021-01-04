'use strict';

const db = require('../models');
const jwt = require('jsonwebtoken');

// Only send what is necessary to the front end.
const prepUserData = userData => {
  return {
    username: userData.username,
    email: userData.email
  }
}

module.exports = {
  findByUsername: async (req, res, next) => {
    try {

      const results = await db.User.findOne({
        where: {
          username: req.params.username
        }
      });

      if (results) {
        res.status(200).send(results.username);
      } else {
        res.status(200).send();
      }

    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    const results = await db.User.findByCredentials(req.body);

    if (results.username) {
      const userData = prepUserData(results);
      const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);
      res.status(200).send({ userData, token });
    } else if (results === 'INCORRECT_PASSWORD') {
      res.status(200).send(results);
    } else {
      res.status(404).send('NOT_FOUND');
    }
  },


  register: async (req, res, next) => {
    try {
      const results = await db.User.create(req.body);
      res.status(201).send(prepUserData(results));
    } catch (err) {
      next(err);
    }
  }
}
