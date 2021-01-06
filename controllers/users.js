'use strict';

const db = require('../models');
const jwt = require('jsonwebtoken');

// Only send what is necessary to the front end.
const prepUserData = userData => {
  const { username, email } = userData;
  return {
    username,
    email
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
      const { user_id } = results;
      const token = jwt.sign({ user_id }, process.env.JWT_SECRET);
      res.status(200).send({ userData, token });
    } else if (results === 'INCORRECT_PASSWORD') {
      res.status(200).send(results);
    } else {
      res.status(404).send('NOT_FOUND');
    }
  },


  loginCookie: async (req, res, next) => {
    if (!req.headers.cookie || !req.headers.cookie.includes('user=')) {
      console.log('nope');
      res.status(200).send();
    }

    try {
      const cookieStr = req.headers.cookie.split('user=').pop().split(';').shift();
      const { user_id } = jwt.verify(cookieStr, process.env.JWT_SECRET);

      const results = await db.User.findOne({ where: { user_id } });
      const userData = prepUserData(results);

      res.status(200).send({ userData });

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


  sendPasswordEmail: async (req, res, next) => {
    res.status(202).send();
    const { email } = req.body;
    const results = await db.User.findOne({ where: { email } });

    if (results) {
      console.log('send email');
    }
  }
}
