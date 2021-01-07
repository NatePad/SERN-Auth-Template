'use strict';

const db = require('../models');
const mailer = require('../middleware/mailer');

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
      mailer.sendPassReset(user_id, email, passResetCode, url);
    } catch (err) {
      next(err);
    }
  }
}
