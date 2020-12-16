'use strict';

const db = require('../models');
 
module.exports = {
  register: async (req, res, next) => {
    try {
      const results = await db.User.create(req.body);
      console.log('results from controller:', results)
    } catch (err) {
      next(err);
    }
  }
}
