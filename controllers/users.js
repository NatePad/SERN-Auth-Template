'use strict';

const db = require('../models');

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
    try {
      // find by credentials?
      // handle password decryption in model?
      const results = await db.User.findOne({
        where: {
          email: req.body.email
        }
      });

      results
        ? res.status(200).send(prepUserData(results))
        : res.status(200).send('NOT_FOUND')

    } catch (err) {
      next(err);
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
