'use strict';

const db = require('../models');

module.exports = {
  email: async (req, res, next) => {
    res.status(202).send();
    const { email } = req.body;
    const userData = await db.User.findOne({ where: { email } });

    if (!userData) {
      return;
    }

    const passResetCode = require('crypto').randomBytes(20).toString('hex');
    const { user_id } = userData;

    try {
      db.PassReset.upsert({ passResetCode, user_id });
      console.log('send email');
    } catch (err) {
      next(err);
    }
  }
}
