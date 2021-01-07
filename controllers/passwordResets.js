'use strict';

const db = require('../models');

module.exports = {
  email: async (req, res, next) => {
    res.status(202).send();
    const { email, url } = req.body;
    const userData = await db.User.findOne({ where: { email } });

    if (!userData) {
      return;
    }

    const { user_id } = userData;
    const passResetCode = require('crypto').randomBytes(20).toString('hex');

    try {
      db.PassReset.upsert({ user_id, passResetCode });
      console.log('send email');
    } catch (err) {
      next(err);
    }
  }
}
