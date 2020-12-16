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
  register: async (req, res, next) => {
    try {
      const results = await db.User.create(req.body);
      res.status(201).send(prepUserData(results));
    } catch (err) {
      next(err);
    }
  }
}
