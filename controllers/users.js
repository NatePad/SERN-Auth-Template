'use strict';

const db = require('../models');
const jwt = require('jsonwebtoken');

const getIdFromCookie = cookie => {
  const cookieStr = cookie.split('user=').pop().split(';').shift();
  return jwt.verify(cookieStr, process.env.JWT_SECRET).user_id;
}

// Only send what is necessary to the front end.
const prepUserData = userData => {
  const { username, email } = userData;
  return { username, email }
};

module.exports = {
  findByUsername: async (req, res, next) => {
    try {
      const results = await db.User.findOne({
        where: { username: req.params.username }
      });

      if (results) {
        res.status(200).send({ username: results.username });
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
      const { user_id } = results;
      const token = jwt.sign({ user_id }, process.env.JWT_SECRET);
      const prod = process.env.NODE_ENV === 'production';

      res.status(200)
        .cookie('user', token, {
          httpOnly: false,
          secure: prod,
          sameSite: 'Strict'
        })
        .send(prepUserData(results));
    } else if (results === 'INCORRECT_PASSWORD') {
      res.status(200).send(results);
    } else {
      res.status(404).send('NOT_FOUND');
    }
  },

  loginCookie: async (req, res, next) => {
    if (!req.headers.cookie || !req.headers.cookie.includes('user=')) {
      res.status(200).send();
      return;
    }

    try {
      const user_id = getIdFromCookie(req.headers.cookie);
      const results = await db.User.findOne({ where: { user_id } });

      // User deleted or bad cookie
      if (!results) {
        res.status(200)
          .cookie('user', '', {
            expires: new Date(Date.now() - 96 * 3600000)
          })
          .send();
        return;
      }

      res.status(200).send(prepUserData(results));
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
  },

  update: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user_id = getIdFromCookie(req.headers.cookie);
      const results = await db.User.findByCredentials({ user_id, password });

      if (results.username) {
        results.username = username;
        results.email = email;
        results.save({ fields: ['username', 'email'] })
        res.status(200).send('UPDATED');
      } else if (results === 'INCORRECT_PASSWORD') {
        res.status(200).send(results);
      } else {
        res.status(404).send('NOT_FOUND');
      }

    } catch (err) {
      next(err);
    }
  }
}
